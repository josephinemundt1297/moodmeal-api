import { Router } from "express";
import { z } from "zod";

import {
  createMoodEntry,
  deleteMoodEntry,
  getAllMoodEntries,
} from "../controllers/moodEntryController.js";
import validate from "../middlewares/validate.js";

const router = Router();

// Dieses Schema prüft neue MoodMeal-Einträge.
// comfortLevel darf nur von 1 bis 5 gehen, damit die Bewertung einfach vergleichbar bleibt.
const createMoodEntrySchema = z.object({
  moodBefore: z.string().min(2).max(40),
  moodAfter: z.string().min(2).max(40),
  meal: z.string().min(2).max(80),
  comfortLevel: z.number().int().min(1).max(5),
  note: z.string().max(300).optional(),
  userId: z.number().int().positive(),
});

router.get("/", getAllMoodEntries);
router.post("/", validate(createMoodEntrySchema), createMoodEntry);
router.delete("/:id", deleteMoodEntry);

export default router;
