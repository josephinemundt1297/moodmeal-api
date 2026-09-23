// Schritt 1 / Aufgabe 1: Testen, ob Jest läuft

test("Jest läuft", () => {
  expect(true).toBe(true);
});
// "Jest läuft" erscheint im Terminal, wenn man npm test ausführt.
// Ist dieser erfolgreich, ist der Status PASS grün.
// Ist dieser nicht erfolgreich, ist der Status FAIL rot und es wird angezeigt, welche Erwartung nicht erfüllt wurde.
// expect: Was wird erwartet? toBe: Was ist der tatsächliche Wert?
