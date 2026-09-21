import { Router } from "express";
import { z } from "zod";

import {
  createUser,
  getAllUsers,
  getUserMoodEntries,
} from "../controllers/userController.js";
import validate from "../middlewares/validate.js";

// Router bedeutet: Wir sammeln passende Routen in einer eigenen Datei.
// Dadurch bleibt server.js übersichtlich.
const router = Router();

// Dieses Schema beschreibt, wie ein neuer User aussehen muss.
// Zod prüft damit den Request-Body.
const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  // z.email() prüft, ob der Text wie eine E-Mail-Adresse aufgebaut ist.
  // Wir nutzen diese Schreibweise, weil z.string().email() in der aktuellen Zod-Version als veraltet markiert ist.
  email: z.email().max(100),
});

router.get("/", getAllUsers);
router.post("/", validate(createUserSchema), createUser);
router.get("/:id/mood-entries", getUserMoodEntries);

export default router;
