const onlyOrganizzatore = (req, res, next) => {
  if (req.user?.Ruolo !== 'Organizzatore') {
    return res.status(403).json({ error: 'Accesso riservato agli organizzatori' });
  }
  next();
};

module.exports = { onlyOrganizzatore };