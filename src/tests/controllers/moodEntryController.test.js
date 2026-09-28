import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { createResponse } from "../helpers/expressMocks.js";

// Prisma-Attrappe fuer die MoodEntry-Controller.
// Wir bilden nur die Methoden nach, die diese Tests wirklich brauchen.
const prismaMock = {
  moodEntry: {
    create: jest.fn(),
    delete: jest.fn(),
  },
};

// Der echte Prisma Client wird durch unseren Mock ersetzt.
// Dadurch brauchen die Tests keine echte Datenbank.
jest.unstable_mockModule("../../database/prismaClient.js", () => ({
  default: prismaMock,
}));

let createMoodEntry;
let deleteMoodEntry;

beforeAll(async () => {
  ({ createMoodEntry, deleteMoodEntry } = await import(
    "../../controllers/moodEntryController.js"
  ));
});

describe("createMoodEntry", () => {
  let res;
  let next;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
    prismaMock.moodEntry.create.mockReset();
    prismaMock.moodEntry.delete.mockReset();
  });

  test("erstellt einen MoodMeal-Eintrag erfolgreich", async () => {
    // Arrange: Request-Body und simuliertes Prisma-Ergebnis vorbereiten.
    const moodEntry = {
      id: 1,
      moodBefore: "gestresst",
      moodAfter: "ruhiger",
      meal: "Miso-Suppe",
      comfortLevel: 5,
      note: "Warm und beruhigend.",
      userId: 1,
    };

    const req = {
      body: {
        moodBefore: "gestresst",
        moodAfter: "ruhiger",
        meal: "Miso-Suppe",
        comfortLevel: 5,
        note: "Warm und beruhigend.",
        userId: 1,
      },
    };

    prismaMock.moodEntry.create.mockResolvedValue(moodEntry);

    // Act: Controller direkt aufrufen.
    await createMoodEntry(req, res, next);

    // Assert: Prisma wird korrekt aufgerufen und die API antwortet mit 201.
    expect(prismaMock.moodEntry.create).toHaveBeenCalledWith({
      data: {
        moodBefore: "gestresst",
        moodAfter: "ruhiger",
        meal: "Miso-Suppe",
        comfortLevel: 5,
        note: "Warm und beruhigend.",
        userId: 1,
      },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "MoodMeal-Eintrag wurde erstellt.",
      data: moodEntry,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("gibt eine unbekannte User-ID als Bad-Request-Fehler weiter", async () => {
    // Arrange: Prisma meldet einen Fremdschluessel-Fehler.
    const error = new Error("Foreign key constraint failed");
    error.code = "P2003";

    const req = {
      body: {
        moodBefore: "müde",
        moodAfter: "wacher",
        meal: "Kaffee",
        comfortLevel: 4,
        userId: 999,
      },
    };

    prismaMock.moodEntry.create.mockRejectedValue(error);

    // Act: Controller direkt aufrufen.
    await createMoodEntry(req, res, next);

    // Assert: Der Controller uebersetzt P2003 in einen 400-Fehler.
    expect(next).toHaveBeenCalledWith(error);
    expect(error.statusCode).toBe(400);
    expect(error.publicMessage).toBe("Der angegebene User existiert nicht.");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("deleteMoodEntry", () => {
  let res;
  let next;

  beforeEach(() => {
    res = createResponse();
    next = jest.fn();
    prismaMock.moodEntry.create.mockReset();
    prismaMock.moodEntry.delete.mockReset();
  });

  test("loescht einen MoodMeal-Eintrag erfolgreich", async () => {
    // Arrange: params.id kommt aus der URL als String.
    const req = {
      params: {
        id: "1",
      },
    };

    prismaMock.moodEntry.delete.mockResolvedValue({
      id: 1,
    });

    // Act: Controller direkt aufrufen.
    await deleteMoodEntry(req, res, next);

    // Assert: Prisma bekommt die ID als Zahl und die API sendet 204.
    expect(prismaMock.moodEntry.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalled();
  });
});
