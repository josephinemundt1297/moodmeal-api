import prisma from "../database/prismaClient.js";

// GET /api/users
// Diese Funktion gibt alle User zurück.
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users
// Diese Funktion erstellt einen neuen User in der Datenbank.
export const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: { name, email },
    });

    res.status(201).json({
      success: true,
      message: "User wurde erstellt.",
      data: user,
    });
  } catch (error) {
    if (error.code === "P2002") {
      error.statusCode = 409;
      error.publicMessage = "Diese E-Mail-Adresse wird bereits benutzt.";
    }

    next(error);
  }
};

// GET /api/users/:id/mood-entries
// Diese Funktion gibt einen User zusammen mit seinen MoodMeal-Einträgen zurück.
export const getUserMoodEntries = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "Die User-ID muss eine ganze Zahl sein.",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: { moodEntries: true },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User wurde nicht gefunden.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
