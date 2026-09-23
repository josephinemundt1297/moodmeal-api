// Aufgabe 2: Eine kleine, realistische Fachlogik aufbauen
// Aufgabe 4: Randfälle prüfen:

// Berechnung um wieviele Punkte sich die Stimmung verbessert/verschlechtert hat
// calculateMoodChange akzeptiert nur Zahlen von 1 bis 5.
export const calculateMoodChange = (moodBeforeLevel, moodAfterLevel) => {
  if (moodBeforeLevel < 1 || moodBeforeLevel > 5) {
    throw new Error("moodBeforeLevel muss zwischen 1 und 5 liegen.");
  }
  if (moodAfterLevel < 1 || moodAfterLevel > 5) {
    throw new Error("moodAfterLevel muss zwischen 1 und 5 liegen.");
  }
  return moodAfterLevel - moodBeforeLevel;
};

// Bennenung bzw. kategorisierung des comfortLevels
// getComfortLabel akzeptiert nur Zahlen von 1 bis 5.
export const getComfortLabel = (comfortLevel) => {
  if (comfortLevel < 1 || comfortLevel > 5) {
    throw new Error("comfortLevel muss zwischen 1 und 5 liegen.");
  }
  if (comfortLevel <= 2) {
    return "niedrig";
  }

  if (comfortLevel === 3) {
    return "mittel";
  }

  return "hoch";
};

// prüfen ob sich die Stimmung verbessert hat
// isPositiveMoodEntry akzeptiert nur Zahlen von 1 bis 5.
export const isPositiveMoodEntry = (moodBeforeLevel, moodAfterLevel) => {
  if (moodBeforeLevel < 1 || moodBeforeLevel > 5) {
    throw new Error("moodBeforeLevel muss zwischen 1 und 5 liegen.");
  }
  if (moodAfterLevel < 1 || moodAfterLevel > 5) {
    throw new Error("moodAfterLevel muss zwischen 1 und 5 liegen.");
  }
  return moodAfterLevel > moodBeforeLevel;
};

// Nun die Ausgabe von beiden Ergebnissen zusammen
export const createMoodSummary = (entry) => {
  const moodChange = calculateMoodChange(
    entry.moodBeforeLevel,
    entry.moodAfterLevel,
  );

  const comfortLabel = getComfortLabel(entry.comfortLevel);

  return `${entry.meal}: Stimmung verändert um ${moodChange}, Comfort-Level ${comfortLabel}.`;
};
