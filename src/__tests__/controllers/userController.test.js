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

    // Assert: Erwartungen kommen gleich im nächsten Schritt.
  });
  // Act: Controller-Aufruf kommt gleich im nächsten Schritt.
  // Assert: Erwartungen kommen gleich im nächsten Schritt.
});
