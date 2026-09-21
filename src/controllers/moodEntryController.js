import prisma from "../database/prismaClient.js";

// GET /api/mood-entries
// Diese Funktion gibt alle MoodMeal-Einträge zurück.
export const getAllMoodEntries = async (req, res, next) => {
  try {
    const moodEntries = await prisma.moodEntry.findMany({
      orderBy: { id: "asc" },
      include: { user: true },
    });

    res.status(200).json({
      success: true,
      data: moodEntries,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/mood-entries
// Diese Funktion erstellt einen neuen MoodMeal-Eintrag.
export const createMoodEntry = async (req, res, next) => {
  try {
    const { moodBefore, moodAfter, meal, comfortLevel, note, userId } = req.body;

    const moodEntry = await prisma.moodEntry.create({
      data: {
        moodBefore,
        moodAfter,
        meal,
        comfortLevel,
        note,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "MoodMeal-Eintrag wurde erstellt.",
      data: moodEntry,
    });
  } catch (error) {
    if (error.code === "P2003") {
      error.statusCode = 400;
      error.publicMessage = "Der angegebene User existiert nicht.";
    }

    next(error);
  }
};

// DELETE /api/mood-entries/:id
// Diese Funktion löscht einen einzelnen MoodMeal-Eintrag.
export const deleteMoodEntry = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "Die MoodEntry-ID muss eine ganze Zahl sein.",
      });
      return;
    }

    await prisma.moodEntry.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      error.statusCode = 404;
      error.publicMessage = "MoodMeal-Eintrag wurde nicht gefunden.";
    }

    next(error);
  }
};
