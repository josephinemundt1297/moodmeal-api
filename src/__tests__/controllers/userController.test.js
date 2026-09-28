import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { createResponse } from "../helpers/expressMocks.js";

// Wir bauen eine Prisma-Attrappe.
// Der createUser-Controller benutzt prisma.user.create(...).
// Deshalb braucht unser Mock genau diese Struktur.
const prismaMock = {
  user: {
    create: jest.fn(),
  },
};

// Wir ersetzen den echten Prisma Client durch unsere Attrappe.
// So spricht der Test nicht mit der echten Datenbank.
jest.unstable_mockModule("../../src/database/prismaClient.js", () => ({
  default: prismaMock,
}));

let createUser;

beforeAll(async () => {
  ({ createUser } = await import("../../src/controllers/userController.js"));
});

describe("createUser", () => {
  let res;
  let next;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
    prismaMock.user.create.mockReset();
  });

  test("erstellt einen User erfolgreich", async () => {
    // Arrange: Wir bereiten Testdaten und das Prisma-Ergebnis vor.
    const user = {
      id: 1,
      name: "Josephine",
      email: "josephine@example.com",
    };

    const req = {
      body: {
        name: "Josephine",
        email: "josephine@example.com",
      },
    };

    prismaMock.user.create.mockResolvedValue(user);

    // Act: Wir rufen den Controller direkt mit falschem req, res und next auf.
    await createUser(req, res, next);

    // Assert: Wir prüfen, ob Prisma und die Response richtig benutzt wurden.    // Hat der Controller prisma.user.create(...) aufgerufen?
    // Und hat er genau name und email an Prisma übergeben?
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: "Josephine",
        email: "josephine@example.com",
      },
    });

    // Hat der Controller res.status(201) aufgerufen?
    // Antwortet der Controller mit dem richtigen Statuscode für "Created"?
    expect(res.status).toHaveBeenCalledWith(201);

    // Hat der Controller genau diese JSON-Antwort gesendet?
    // Bekommt der Client die richtige Antwort?
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User wurde erstellt.",
      data: user,
    });

    // Bei einem erfolgreichen Request soll next nicht aufgerufen werden.
    // next wäre nur für Fehlerfälle wichtig.
    expect(next).not.toHaveBeenCalled();
  });
});
