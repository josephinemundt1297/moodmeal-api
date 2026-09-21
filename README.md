# MoodMeal API

MoodMeal ist eine kleine Backend-API.

API bedeutet **Application Programming Interface**. Eine API ist eine Schnittstelle, über die ein Frontend oder ein anderes Programm mit unserem Backend sprechen kann.

Die Idee: User können speichern, welches Essen zu welcher Stimmung gehört hat. Zum Beispiel: Vorher gestresst, danach ruhiger, gegessen wurde Suppe.

## Warum dieses Projekt?

Das Projekt ist klein genug, um es in kurzer Zeit zu bauen und zu erklären. Es ist aber nicht nur eine klassische Todo-Liste oder ein Shop.

Die API erfüllt die wichtigsten Anforderungen:

- mindestens zwei verknüpfte Entitäten
- Datenbank-Anbindung
- mehrere Endpunkte
- Validierung
- einfache Sicherheitsmaßnahmen
- modulare Struktur
- Dokumentation mit Plan und ERD

## Grundbegriffe

Eine **Entität** ist ein Ding, das wir speichern wollen. In unserem Projekt sind `User` und `MoodEntry` Entitäten.

Ein **User** ist eine Person.

Ein **MoodEntry** ist ein einzelner Eintrag darüber, welches Essen zu welcher Stimmung gehört hat.

**Validierung** bedeutet, dass wir Eingabedaten prüfen, bevor wir sie benutzen oder speichern. Wenn jemand zum Beispiel `"email": "banane"` sendet, soll die API das ablehnen, weil das keine gültige E-Mail-Adresse ist.

Eine **modulare Struktur** bedeutet, dass nicht der gesamte Code in einer einzigen Datei steht. Jede Datei hat eine klare Aufgabe:

- `routes`: Welche URLs gibt es?
- `controllers`: Was passiert bei diesen URLs?
- `middlewares`: Welche Prüfungen oder Zusatzaufgaben passieren dazwischen?
- `database`: Wie verbindet sich der Code mit der Datenbank?
- `prisma`: Wie sieht der Datenbank-Plan aus?

HTTP bedeutet **Hypertext Transfer Protocol**. Das ist das Protokoll, mit dem Browser, Postman, Frontends und Backends miteinander sprechen.

Ein **Request** ist eine Anfrage an den Server.

Eine **Response** ist die Antwort vom Server.

Ein **Header** ist eine Zusatzinformation bei einem Request oder einer Response. Ein wichtiger Header ist `Content-Type`. Er sagt zum Beispiel: Die gesendeten Daten sind JSON.

JSON bedeutet **JavaScript Object Notation**. Das ist ein Datenformat, das so aussieht:

```json
{
  "name": "Josephine",
  "email": "josephine@example.com"
}
```

## Verwendete Techniken

**Node.js** ist die Laufzeitumgebung. Damit kann JavaScript außerhalb vom Browser laufen.

**Express** ist ein Framework für Node.js. Es hilft uns, HTTP-Routen wie `GET /api/users` oder `POST /api/users` zu bauen.

**PostgreSQL** ist eine relationale SQL-Datenbank. SQL bedeutet **Structured Query Language**. Damit werden Daten in Tabellen gespeichert und abgefragt.

**Prisma** ist ein ORM. ORM bedeutet **Object-Relational Mapping**. Prisma verbindet unseren JavaScript-Code mit der Datenbank und übersetzt viele Aktionen in SQL.

**Zod** prüft Eingabedaten. So stellen wir sicher, dass zum Beispiel eine E-Mail wirklich wie eine E-Mail aussieht.

**CORS** bedeutet **Cross-Origin Resource Sharing**. Damit steuern wir, welches Frontend im Browser unsere API benutzen darf.

**Rate Limiting** begrenzt die Anzahl der Anfragen. Das schützt die API vor zu vielen Anfragen in kurzer Zeit.

**Postman** ist ein Programm zum Testen von APIs. Damit kann man Anfragen wie `GET`, `POST` oder `DELETE` senden, ohne ein eigenes Frontend zu bauen.

## Entitäten

### User

Ein User ist eine Person, die MoodMeal-Einträge erstellen kann.

Felder:

- `id`
- `name`
- `email`
- `createdAt`
- `updatedAt`

### MoodEntry

Ein MoodEntry ist ein einzelner MoodMeal-Eintrag.

Felder:

- `id`
- `moodBefore`
- `moodAfter`
- `meal`
- `comfortLevel`
- `note`
- `userId`
- `createdAt`
- `updatedAt`

## Beziehung

Ein User kann viele MoodEntries haben.

Ein MoodEntry gehört zu genau einem User.

## ERD

ERD bedeutet **Entity-Relationship Diagram**. Es zeigt Tabellen und Beziehungen.

Auf Deutsch bedeutet das ungefähr: Entitäts-Beziehungs-Diagramm.

Der wichtigste Satz im Diagramm ist:

```txt
Ein User hat viele MoodEntries.
Ein MoodEntry gehört zu genau einem User.
```

```mermaid
erDiagram
  USER ||--o{ MOOD_ENTRY : hat

  USER {
    int id
    string name
    string email
    datetime createdAt
    datetime updatedAt
  }

  MOOD_ENTRY {
    int id
    string moodBefore
    string moodAfter
    string meal
    int comfortLevel
    string note
    int userId
    datetime createdAt
    datetime updatedAt
  }
```

Diese Zeile beschreibt die Beziehung:

```txt
USER ||--o{ MOOD_ENTRY : hat
```

Einfach gelesen:

```txt
USER 1 ---- viele MOOD_ENTRY
```

Beispiel:

```txt
Josephine kann viele MoodMeal-Einträge haben.
Ein einzelner MoodMeal-Eintrag gehört aber nur zu einem User.
```

`userId` in `MoodEntry` ist der Fremdschlüssel. Ein Fremdschlüssel ist ein Feld, das auf einen Datensatz in einer anderen Tabelle zeigt.

## Endpunkte

| Methode | Route | Beschreibung |
| --- | --- | --- |
| GET | `/` | Testet, ob die API läuft |
| GET | `/api/users` | Gibt alle User zurück |
| POST | `/api/users` | Erstellt einen User |
| GET | `/api/users/:id/mood-entries` | Gibt einen User mit seinen MoodMeal-Einträgen zurück |
| GET | `/api/mood-entries` | Gibt alle MoodMeal-Einträge zurück |
| POST | `/api/mood-entries` | Erstellt einen MoodMeal-Eintrag |
| DELETE | `/api/mood-entries/:id` | Löscht einen MoodMeal-Eintrag |

## Beispiel-Requests

### User erstellen

```json
{
  "name": "Josephine",
  "email": "josephine@example.com"
}
```

### MoodMeal-Eintrag erstellen

```json
{
  "moodBefore": "gestresst",
  "moodAfter": "ruhiger",
  "meal": "Miso-Suppe",
  "comfortLevel": 5,
  "note": "Warm, salzig und genau richtig nach einem langen Tag.",
  "userId": 1
}
```

## Setup

1. Abhängigkeiten installieren:

```bash
npm install
```

Das installiert alle Pakete aus `package.json`, zum Beispiel Express, Prisma und Zod.

2. `.env.example` kopieren und in `.env` umbenennen.

`.env.example` ist nur die Vorlage. `.env` ist die echte lokale Einstellungsdatei.

`.env` wird nicht auf GitHub hochgeladen, weil dort später auch geheime Daten wie Passwörter stehen können.

3. `DATABASE_URL` in `.env` an die eigene PostgreSQL-Datenbank anpassen.

`DATABASE_URL` ist die Adresse zur Datenbank. Prisma benutzt diese Adresse, um PostgreSQL zu finden.

4. Prisma Client erzeugen:

```bash
npm run prisma:generate
```

Der Prisma Client ist automatisch erzeugter JavaScript-Code.

Damit können wir im Projekt schreiben:

```js
prisma.user.findMany();
prisma.moodEntry.create();
```

Ohne den Prisma Client weiß unser JavaScript-Code nicht sauber, welche Datenbank-Modelle aus `schema.prisma` existieren.

5. Migration ausführen:

```bash
npm run prisma:migrate
```

Eine Migration ist eine Änderung an der Datenbankstruktur.

Unser `schema.prisma` ist der Plan. Dort steht zum Beispiel:

```txt
Es soll eine User-Tabelle geben.
Es soll eine MoodEntry-Tabelle geben.
```

`prisma migrate` macht daraus echte Tabellen in PostgreSQL.

6. Server starten:

```bash
npm run dev
```

Das startet den Express-Server mit `nodemon`.

`nodemon` startet den Server automatisch neu, wenn wir Code ändern.

## Sicherheit

Dieses Projekt nutzt mehrere einfache Sicherheitsmaßnahmen:

- JSON-Body-Limit auf `10kb`
- CORS-Konfiguration
- Rate Limiting
- Zod-Validierung
- zentrale Fehlerbehandlung
- keine Datenbank-Zugangsdaten im Code
- keine technischen Fehlerdetails in normalen Client-Antworten

## Umgebungsvariablen

Umgebungsvariablen sind Einstellungen, die außerhalb vom Code liegen.

In diesem Projekt stehen sie in `.env`.

Beispiel:

```txt
PORT=3000
HOST="127.0.0.1"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moodmeal_api?schema=public"
ALLOWED_ORIGIN="http://localhost:5173"
```

`PORT=3000` bedeutet: Das Backend läuft auf Port 3000. Ein Port ist wie eine Türnummer auf deinem Computer.

`HOST="127.0.0.1"` bedeutet: Der Server ist nur auf deinem eigenen Computer erreichbar.

`DATABASE_URL` ist die Datenbank-Adresse.

Diese Adresse:

```txt
postgresql://postgres:postgres@localhost:5432/moodmeal_api?schema=public
```

bedeutet:

- `postgresql://`: Wir benutzen PostgreSQL.
- erstes `postgres`: Benutzername der Datenbank.
- zweites `postgres`: Passwort der Datenbank.
- `localhost`: Die Datenbank läuft auf deinem Computer.
- `5432`: Standard-Port von PostgreSQL.
- `moodmeal_api`: Name der Datenbank.
- `schema=public`: Standardbereich innerhalb von PostgreSQL.

`ALLOWED_ORIGIN="http://localhost:5173"` ist die Frontend-Adresse, die per CORS erlaubt wird.

## CORS einfach erklärt

CORS bedeutet **Cross-Origin Resource Sharing**.

Ein Browser ist vorsichtig, wenn ein Frontend mit einem Backend sprechen will.

Beispiel:

```txt
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

Für den Browser sind das zwei verschiedene Orte, weil die Ports unterschiedlich sind.

CORS sagt dann:

```txt
Dieses Frontend darf mit diesem Backend sprechen.
```

`ALLOWED_ORIGIN` ist deshalb die Adresse vom Frontend, nicht die Adresse vom Backend.

## Wichtige Code-Dateien

### `src/server.js`

`server.js` ist der Startpunkt der API.

Dort passiert:

- Express-App erstellen
- CORS einstellen
- JSON-Body aktivieren
- Rate Limiting aktivieren
- Routen einbinden
- Fehlerbehandlung einbinden
- Server starten

Dieser Import lädt die `.env`-Datei:

```js
import "dotenv/config";
```

Er importiert keine einzelne Variable. Er führt direkt Code aus, damit `process.env.PORT`, `process.env.DATABASE_URL` und andere Werte verfügbar werden.

`const port` und `const host` sind Konstanten, weil diese Werte beim Start festgelegt werden und danach nicht mehr verändert werden sollen.

### `corsOptions`

```js
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
};
```

`origin` sagt, welches Frontend erlaubt ist.

`methods` sagt, welche HTTP-Methoden erlaubt sind.

`allowedHeaders: ["Content-Type"]` erlaubt dem Client zu sagen, welches Datenformat gesendet wird. Für unsere API ist das meistens JSON.

### `apiLimiter`

Rate Limiting bedeutet: Wir begrenzen die Anzahl der Anfragen.

```js
windowMs: 15 * 60 * 1000
```

Das sind 15 Minuten:

```txt
1000 Millisekunden = 1 Sekunde
60 * 1000 = 1 Minute
15 * 60 * 1000 = 15 Minuten
```

`standardHeaders: true` bedeutet: Der Server sendet moderne Rate-Limit-Informationen in den Antwort-Headers.

`legacyHeaders: false` bedeutet: Alte Header werden nicht mehr gesendet.

Legacy bedeutet alt oder veraltet.

### Serverstart

```js
const server = app.listen(port, host, () => {
  console.log(`MoodMeal API läuft auf http://${host}:${port}`);
});
```

`app.listen` startet den Server.

`${host}` und `${port}` sind Platzhalter in einem Template String.

Wenn `host` den Wert `127.0.0.1` hat und `port` den Wert `3000`, wird daraus:

```txt
http://127.0.0.1:3000
```

### Server-Fehler

`EADDRINUSE` bedeutet **Error Address In Use**.

Das heißt: Der Port wird schon von einem anderen Programm benutzt.

`EPERM` bedeutet **Error Permission**.

Das heißt: Keine Berechtigung. In der Codex-Umgebung kann das passieren, weil dort lokale Server-Ports eingeschränkt sind.

## Routes, Controller und Middleware

Eine **Route** verbindet eine URL mit einer Funktion.

Beispiel:

```js
router.post("/", validate(createUserSchema), createUser);
```

Das bedeutet:

```txt
POST /api/users
erst validieren
dann createUser ausführen
```

Ein **Controller** enthält die eigentliche Logik.

Beispiel:

```txt
User in der Datenbank erstellen.
Antwort zurücksenden.
```

Eine **Middleware** ist eine Funktion, die zwischen Request und Response läuft.

Beispiel:

```txt
Request kommt rein
Middleware prüft die Daten
Controller arbeitet mit den geprüften Daten
Response geht raus
```

## Zod und Schemas

Zod ist eine Bibliothek zur Validierung.

Ein Schema ist ein Bauplan für Daten.

Dieses Schema prüft neue User:

```js
const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.email().max(100),
});
```

Das bedeutet:

- `name` muss Text sein.
- `name` muss mindestens 2 Zeichen haben.
- `name` darf maximal 50 Zeichen haben.
- `email` muss wie eine E-Mail-Adresse aussehen.
- `email` darf maximal 100 Zeichen haben.

Dieses Schema prüft neue MoodMeal-Einträge:

```js
const createMoodEntrySchema = z.object({
  moodBefore: z.string().min(2).max(40),
  moodAfter: z.string().min(2).max(40),
  meal: z.string().min(2).max(80),
  comfortLevel: z.number().int().min(1).max(5),
  note: z.string().max(300).optional(),
  userId: z.number().int().positive(),
});
```

Das bedeutet:

- `moodBefore` muss Text sein, mindestens 2 und maximal 40 Zeichen.
- `moodAfter` muss Text sein, mindestens 2 und maximal 40 Zeichen.
- `meal` muss Text sein, mindestens 2 und maximal 80 Zeichen.
- `comfortLevel` muss eine ganze Zahl von 1 bis 5 sein.
- `note` ist optional und darf maximal 300 Zeichen haben.
- `userId` muss eine positive ganze Zahl sein.

## `safeParse`

`safeParse` prüft Daten gegen ein Zod-Schema.

```js
const result = schema.safeParse(req.body);
```

`req.body` sind die Daten, die der Client gesendet hat.

Der Vorteil von `safeParse`:

```txt
Es wirft keinen direkten Fehler.
Es gibt ein Ergebnis zurück.
```

Danach können wir prüfen:

```js
if (!result.success) {
  // Daten sind ungültig
}
```

## Prisma im Projekt

Prisma ist ein ORM.

ORM bedeutet **Object-Relational Mapping**.

Mit Prisma können wir Datenbankabfragen in JavaScript schreiben.

Statt selbst SQL zu schreiben:

```sql
SELECT * FROM users;
```

schreiben wir:

```js
prisma.user.findMany();
```

In `src/database/prismaClient.js` erstellen wir den Prisma Client:

```js
const prisma = new PrismaClient();
```

Alle Controller importieren diesen Client. Ohne ihn könnten die Controller nicht mit der Datenbank sprechen.

## Prisma-Methoden und Fehlercodes

`findMany` bedeutet: Finde viele Datensätze.

```js
const moodEntries = await prisma.moodEntry.findMany({
  orderBy: { id: "asc" },
  include: { user: true },
});
```

Das bedeutet:

- Suche alle MoodMeal-Einträge.
- Sortiere sie nach `id` aufsteigend.
- Lade den passenden User direkt mit.

`asc` bedeutet ascending, also aufsteigend:

```txt
1, 2, 3, 4
```

`include: { user: true }` bedeutet:

```txt
Gib nicht nur den MoodEntry zurück.
Gib auch den zugehörigen User zurück.
```

`P2002` ist ein Prisma-Fehlercode für einen verletzten Unique Constraint.

Unique bedeutet eindeutig. Bei uns darf eine E-Mail-Adresse nur einmal vorkommen.

`P2003` ist ein Prisma-Fehlercode für einen Fremdschlüssel-Fehler.

Bei uns passiert das, wenn ein MoodEntry mit einer `userId` erstellt werden soll, aber dieser User gar nicht existiert.

## HTTP-Statuscodes

Statuscodes sagen, wie eine Anfrage ausgegangen ist.

- `200`: OK, Anfrage erfolgreich.
- `201`: Created, etwas wurde neu erstellt.
- `204`: No Content, erfolgreich, aber ohne Antwortdaten.
- `400`: Bad Request, Anfrage war fehlerhaft.
- `404`: Not Found, nicht gefunden.
- `409`: Conflict, Konflikt mit vorhandenen Daten.
- `500`: Internal Server Error, unerwarteter Serverfehler.
