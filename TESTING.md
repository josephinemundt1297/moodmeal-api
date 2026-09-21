# Testprotokoll

Dieses Dokument beschreibt, wie die MoodMeal API getestet wurde.

Getestet wurde mit der Postman Extension in Visual Studio Code.

## Vorbereitung

Der Server wurde im Projektordner gestartet:

```bash
npm run dev
```

Erwartete Konsolenausgabe:

```txt
MoodMeal API läuft auf http://127.0.0.1:3000
```

Die Datenbank wurde vorher mit Prisma vorbereitet:

```bash
npm run prisma:migrate -- --name init
```

Dabei wurden die Tabellen aus `prisma/schema.prisma` in PostgreSQL erstellt.

## Erfolgreich getestete Endpunkte

### 1. Server erreichbar

Methode:

```txt
GET
```

URL:

```txt
http://127.0.0.1:3000/
```

Erwarteter Status:

```txt
200 OK
```

Ergebnis:

```txt
erfolgreich
```

### 2. Alle User abrufen

Methode:

```txt
GET
```

URL:

```txt
http://127.0.0.1:3000/api/users
```

Erwarteter Status:

```txt
200 OK
```

Ergebnis:

```txt
erfolgreich
```

### 3. User erstellen

Methode:

```txt
POST
```

URL:

```txt
http://127.0.0.1:3000/api/users
```

Body:

```json
{
  "name": "Josephine",
  "email": "josephine@example.com"
}
```

Erwarteter Status:

```txt
201 Created
```

Ergebnis:

```txt
erfolgreich
```

### 4. MoodMeal-Eintrag erstellen

Methode:

```txt
POST
```

URL:

```txt
http://127.0.0.1:3000/api/mood-entries
```

Body:

```json
{
  "moodBefore": "gestresst",
  "moodAfter": "ruhiger",
  "meal": "Miso-Suppe",
  "comfortLevel": 5,
  "note": "Warm und beruhigend.",
  "userId": 1
}
```

Erwarteter Status:

```txt
201 Created
```

Ergebnis:

```txt
erfolgreich
```

### 5. Alle MoodMeal-Einträge abrufen

Methode:

```txt
GET
```

URL:

```txt
http://127.0.0.1:3000/api/mood-entries
```

Erwarteter Status:

```txt
200 OK
```

Ergebnis:

```txt
erfolgreich
```

### 6. Beziehung zwischen User und MoodEntry testen

Methode:

```txt
GET
```

URL:

```txt
http://127.0.0.1:3000/api/users/1/mood-entries
```

Erwarteter Status:

```txt
200 OK
```

Erwartung:

```txt
Der User wird zusammen mit seinen MoodMeal-Einträgen angezeigt.
```

Ergebnis:

```txt
erfolgreich
```

### 7. MoodMeal-Eintrag löschen

Methode:

```txt
DELETE
```

URL:

```txt
http://127.0.0.1:3000/api/mood-entries/1
```

Erwarteter Status:

```txt
204 No Content
```

Ergebnis:

```txt
erfolgreich
```

Danach wurde mit `GET /api/mood-entries` geprüft, dass der gelöschte Eintrag nicht mehr angezeigt wird.

## Erfolgreich getestete Fehlerfälle

### 1. Ungültige E-Mail

Methode:

```txt
POST
```

URL:

```txt
http://127.0.0.1:3000/api/users
```

Body:

```json
{
  "name": "Jo",
  "email": "banane"
}
```

Erwarteter Status:

```txt
400 Bad Request
```

Ergebnis:

```txt
erfolgreich
```

### 2. Doppelte E-Mail

Methode:

```txt
POST
```

URL:

```txt
http://127.0.0.1:3000/api/users
```

Body:

```json
{
  "name": "Josephine",
  "email": "josephine@example.com"
}
```

Erwarteter Status:

```txt
409 Conflict
```

Ergebnis:

```txt
erfolgreich
```

### 3. MoodMeal-Eintrag mit falscher User-ID

Methode:

```txt
POST
```

URL:

```txt
http://127.0.0.1:3000/api/mood-entries
```

Body:

```json
{
  "moodBefore": "müde",
  "moodAfter": "wacher",
  "meal": "Kaffee",
  "comfortLevel": 4,
  "note": "Hat kurz geholfen.",
  "userId": 999
}
```

Erwarteter Status:

```txt
400 Bad Request
```

Ergebnis:

```txt
erfolgreich
```

## Erkenntnis aus dem Test

Die API kann Daten erstellen, abrufen, verknüpfte Daten anzeigen und einen MoodMeal-Eintrag löschen.

Außerdem reagieren die Endpunkte sinnvoll auf falsche Eingaben.

Damit sind die wichtigsten Anforderungen aus dem Mini-Projekt getestet:

- mindestens zwei verknüpfte Entitäten
- Datenbank-Anbindung
- mehrere Endpunkte
- Validierung
- Fehlerbehandlung
- Test mit Postman
