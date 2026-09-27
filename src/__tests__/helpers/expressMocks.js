// Werkzeug für Tests - hier wird KEIN tatsächlicher Test durchgeführt.

import { jest } from "@jest/globals";

// Diese Funktion baut ein falsches Express-Response-Objekt.
// So können wir Controller testen, ohne einen echten Server zu starten.
export const createResponse = () => {
  const res = {};

  // res.status(201).json(...) funktioniert in Express als Verkettung.
  // Darum geben wir bei status wieder res zurück.
  res.status = jest.fn(() => res);

  // res.json(...) merkt sich später, welche Antwort der Controller senden wollte.
  res.json = jest.fn(() => res);

  // send brauchen wir z. B. für 204 No Content.
  res.send = jest.fn(() => res);

  return res;
};
