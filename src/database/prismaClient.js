import { PrismaClient } from "@prisma/client";

// PrismaClient ist die Verbindung zwischen unserem JavaScript-Code und der Datenbank.
// Wir legen ihn in eine eigene Datei, damit alle Controller dieselbe Verbindung benutzen.
const prisma = new PrismaClient();

export default prisma;
