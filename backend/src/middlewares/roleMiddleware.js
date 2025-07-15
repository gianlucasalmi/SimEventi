const onlyOrganizzatore = (req, res, next) => {
  if (req.user?.Ruolo !== 'Organizzatore') {
    return res.status(403).json({ error: 'Accesso riservato agli organizzatori' });
  }
  next();
};

const onlyResponsabile = (req, res, next) => {
  if (req.user?.Ruolo !== 'Responsabile') {
    return res.status(403).json({ error: 'Accesso riservato ai responsabili' });
  }
  next();
};

const register = async (req, res) => {
  const { Nome, Cognome, Email, Password, Ruolo } = req.body;

  // Validazione dei campi
  if (!Nome || !Cognome || !Email || !Password || !Ruolo) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  // Controllo del ruolo
  if (!['Dipendente', 'Responsabile'].includes(Ruolo)) {
    return res.status(400).json({ error: 'Ruolo non valido. Deve essere Dipendente o Responsabile' });
  }

  try {
    // Controllo se l'email è già registrata
    const existing = await prisma.utente.findUnique({ where: { Email } });
    if (existing) return res.status(409).json({ error: 'Email già registrata' });

    // Hash della password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Creazione del nuovo utente
    const nuovoUtente = await prisma.utente.create({
      data: {
        Nome,
        Cognome,
        Email,
        Password: hashedPassword,
        Ruolo,
      },
    });

    res.status(201).json({ message: 'Registrazione avvenuta con successo', utente: nuovoUtente });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};

module.exports = { onlyOrganizzatore, onlyResponsabile, register };