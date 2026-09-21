// Diese Middleware sammelt Fehler an einer zentralen Stelle.
// Middleware bedeutet: Eine Funktion, die zwischen Anfrage und Antwort ausgeführt wird.
const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  // Interne Fehler loggen wir in der Konsole.
  // An den Client schicken wir nur einfache Nachrichten, damit keine technischen Details nach außen gehen.
  console.error({
    route: req.originalUrl,
    message: error.message,
    code: error.code,
  });

  const statusCode = error.statusCode || 500;
  const message = error.publicMessage || "Interner Serverfehler.";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
