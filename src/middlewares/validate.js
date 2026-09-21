// Diese Funktion erstellt eine Middleware für Zod-Validierung.
// Zod prüft, ob die Daten im Request-Body das richtige Format haben.
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Die gesendeten Daten sind ungültig.",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    // Wir speichern die geprüften Daten zurück in req.body.
    // Dadurch arbeiten die Controller nur mit Daten, die Zod akzeptiert hat.
    req.body = result.data;
    next();
  };
};

export default validate;
