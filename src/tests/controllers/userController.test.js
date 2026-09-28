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
    findUnique: jest.fn(),
  },
};

// Wir ersetzen den echten Prisma Client durch unsere Attrappe.
// So spricht der Test nicht mit der echten Datenbank.
jest.unstable_mockModule("../../database/prismaClient.js", () => ({
  default: prismaMock,
}));

let createUser;
let getUserMoodEntries;

beforeAll(async () => {
  ({ createUser, getUserMoodEntries } = await import(
    "../../controllers/userController.js"
  ));
});

describe("createUser", () => {
  let res;
  let next;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
    prismaMock.user.create.mockReset();
    prismaMock.user.findUnique.mockReset();
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

    // Assert: Wir prüfen, ob Prisma und die Response richtig benutzt wurden.
    // Hat der Controller prisma.user.create(...) aufgerufen?
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

  test("gibt doppelte E-Mail als Conflict-Fehler weiter", async () => {
    // Arrange: Wir simulieren den Prisma-Fehler fuer ein eindeutiges Feld.
    const error = new Error("Unique constraint failed");
    error.code = "P2002";

    const req = {
      body: {
        name: "Josephine",
        email: "josephine@example.com",
      },
    };

    prismaMock.user.create.mockRejectedValue(error);

    // Act: Der Controller bekommt einen Request, bei dem Prisma ablehnt.
    await createUser(req, res, next);

    // Assert: Der Fehler wird fuer unsere API verstaendlich vorbereitet.
    expect(next).toHaveBeenCalledWith(error);
    expect(error.statusCode).toBe(409);
    expect(error.publicMessage).toBe(
      "Diese E-Mail-Adresse wird bereits benutzt.",
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("getUserMoodEntries", () => {
  let res;
  let next;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
    prismaMock.user.create.mockReset();
    prismaMock.user.findUnique.mockReset();
  });

  test("holt einen User mit seinen MoodMeal-Eintraegen", async () => {
    // Arrange: params.id kommt aus einer URL immer als String.
    const user = {
      id: 1,
      name: "Josephine",
      email: "josephine@example.com",
      moodEntries: [
        {
          id: 1,
          meal: "Miso-Suppe",
          moodBefore: "gestresst",
          moodAfter: "ruhiger",
          comfortLevel: 5,
          userId: 1,
        },
      ],
    };

    const req = {
      params: {
        id: "1",
      },
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    // Act: Wir rufen den Controller direkt auf.
    await getUserMoodEntries(req, res, next);

    // Assert: Prisma bekommt die ID als Zahl und laedt die Relation mit.
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { moodEntries: true },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: user,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
