// Wir importieren die Funktionen, die wir testen möchten.
// Der Pfad geht eine Ebene aus __tests__ heraus und dann zur Datei moodEntryUtils.js.
import {
  calculateMoodChange,
  getComfortLabel,
  isPositiveMoodEntry,
  createMoodSummary,
} from "../moodEntryUtils.js";

// describe gruppiert mehrere Tests, die zur gleichen Funktion gehören.
// Hier testen wir die Funktion calculateMoodChange.
describe("calculateMoodChange", () => {
  // Dieser Test prüft den Fall, dass sich die Stimmung verbessert.
  // Beispiel: vorher 2, nachher 5 => Veränderung ist +3.
  test("berechnet eine positive Stimmungsveränderung", () => {
    expect(calculateMoodChange(2, 5)).toBe(3);
  });

  // Dieser Test prüft den Fall, dass die Stimmung gleich bleibt.
  // Beispiel: vorher 3, nachher 3 => Veränderung ist 0.
  test("berechnet keine Veränderung", () => {
    expect(calculateMoodChange(3, 3)).toBe(0);
  });

  // Dieser Test prüft den Fall, dass die Stimmung schlechter wird.
  // Beispiel: vorher 5, nachher 2 => Veränderung ist -3.
  test("berechnet eine negative Stimmungsveränderung", () => {
    expect(calculateMoodChange(5, 2)).toBe(-3);
  });
});

// Hier testen wir die Funktion getComfortLabel.
// Sie wandelt eine Zahl in eine verständliche Bewertung um.
describe("getComfortLabel", () => {
  // Comfort-Level 1 soll als niedrig eingestuft werden.
  test("gibt niedrig bei Comfort-Level 1 zurück", () => {
    expect(getComfortLabel(1)).toBe("niedrig");
  });

  // Comfort-Level 3 soll als mittel eingestuft werden.
  test("gibt mittel bei Comfort-Level 3 zurück", () => {
    expect(getComfortLabel(3)).toBe("mittel");
  });

  // Comfort-Level 5 soll als hoch eingestuft werden.
  test("gibt hoch bei Comfort-Level 5 zurück", () => {
    expect(getComfortLabel(5)).toBe("hoch");
  });
});

// Hier testen wir die Funktion isPositiveMoodEntry.
// Sie prüft, ob die Stimmung nach dem Essen besser ist als vorher.
describe("isPositiveMoodEntry", () => {
  // Wenn der Wert nachher größer ist als vorher, soll true zurückkommen.
  test("gibt true zurück, wenn Stimmung besser wurde", () => {
    expect(isPositiveMoodEntry(2, 4)).toBe(true);
  });

  // Wenn beide Werte gleich sind, wurde die Stimmung nicht besser.
  // Deshalb erwarten wir false.
  test("gibt false zurück, wenn Stimmung gleich bleibt", () => {
    expect(isPositiveMoodEntry(3, 3)).toBe(false);
  });

  // Wenn der Wert nachher kleiner ist als vorher, wurde die Stimmung schlechter.
  // Deshalb erwarten wir ebenfalls false.
  test("gibt false zurück, wenn Stimmung schlechter wurde", () => {
    expect(isPositiveMoodEntry(5, 2)).toBe(false);
  });
});

// Aufgabe 4: Randfälle prüfen

// Prüfung einer Sammlung von Randfällen
describe("calculateMoodChange Randfälle", () => {
  test("wirft Fehler bei moodBeforeLevel 0", () => {
    expect(() => calculateMoodChange(0, 3)).toThrow(
      "moodBeforeLevel muss zwischen 1 und 5 liegen.",
    );
  });

  test("wirft Fehler bei moodAfterLevel 6", () => {
    expect(() => calculateMoodChange(3, 6)).toThrow(
      "moodAfterLevel muss zwischen 1 und 5 liegen.",
    );
  });
});

describe("getComfortLabel Randfälle", () => {
  test("gibt niedrig bei Comfort-Level 2 zurück", () => {
    expect(getComfortLabel(2)).toBe("niedrig");
  });

  test("gibt hoch bei Comfort-Level 4 zurück", () => {
    expect(getComfortLabel(4)).toBe("hoch");
  });

  test("wirft Fehler bei Comfort-Level 0", () => {
    expect(() => getComfortLabel(0)).toThrow(
      "comfortLevel muss zwischen 1 und 5 liegen.",
    );
  });

  test("wirft Fehler bei Comfort-Level 6", () => {
    expect(() => getComfortLabel(6)).toThrow(
      "comfortLevel muss zwischen 1 und 5 liegen.",
    );
  });
});

describe("isPositiveMoodEntry Randfälle", () => {
  test("wirft Fehler bei moodBeforeLevel 0", () => {
    expect(() => isPositiveMoodEntry(0, 3)).toThrow(
      "moodBeforeLevel muss zwischen 1 und 5 liegen.",
    );
  });

  test("wirft Fehler bei moodAfterLevel 6", () => {
    expect(() => isPositiveMoodEntry(3, 6)).toThrow(
      "moodAfterLevel muss zwischen 1 und 5 liegen.",
    );
  });
});

describe("createMoodSummary", () => {
  test("erstellt eine Zusammenfassung für einen MoodMeal-Eintrag", () => {
    const entry = {
      meal: "Miso-Suppe",
      moodBeforeLevel: 2,
      moodAfterLevel: 4,
      comfortLevel: 5,
    };

    expect(createMoodSummary(entry)).toBe(
      "Miso-Suppe: Stimmung verändert um 2, Comfort-Level hoch.",
    );
  });
});
