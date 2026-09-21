import "dotenv/config";

import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";

import errorHandler from "./middlewares/errorHandler.js";
import moodEntryRoutes from "./routes/moodEntryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// API bedeutet Application Programming Interface.
// Eine API ist eine Schnittstelle, über die andere Programme mit unserem Backend sprechen können.

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

// CORS bedeutet Cross-Origin Resource Sharing.
// Damit legen wir fest, welches Frontend unsere API im Browser benutzen darf.
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

// Rate Limiting begrenzt, wie viele Anfragen ein Client in einer bestimmten Zeit senden darf.
// Das schützt die API vor zu vielen Anfragen auf einmal.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Zu viele Anfragen. Bitte später erneut versuchen.",
  },
});

app.use(cors(corsOptions));

// express.json liest JSON-Daten aus dem Request-Body.
// Das Limit von 10kb verhindert unnötig große Requests.
app.use(express.json({ limit: "10kb" }));

app.use("/api", apiLimiter);
app.use("/api/users", userRoutes);
app.use("/api/mood-entries", moodEntryRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MoodMeal API läuft.",
  });
});

// Wenn keine Route passt, senden wir eine klare 404-Antwort.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route wurde nicht gefunden.",
  });
});

app.use(errorHandler);

// app.listen startet den HTTP-Server.
// Wir speichern ihn in einer Konstante, damit Node den laufenden Server sicher behält.
const server = app.listen(port, host, () => {
  console.log(`MoodMeal API läuft auf http://${host}:${port}`);
});

// Falls der Server nicht starten kann, erklären wir den häufigsten Fehler verständlich.
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} wird bereits benutzt.`);
    return;
  }

  if (error.code === "EPERM") {
    console.error(`Der Server darf auf ${host}:${port} nicht gestartet werden.`);
    return;
  }

  console.error("Der Server konnte nicht gestartet werden.", error);
});

export default app;
export { server };
