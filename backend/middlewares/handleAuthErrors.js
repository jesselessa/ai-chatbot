export const handleAuthErrors = (req, res, next) => {
  if (!req.auth?.userId)
    return res.status(401).json({ error: "Unauthenticated user" });

  next();
};
