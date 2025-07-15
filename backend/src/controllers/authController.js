const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

const login = async (req, res) => {
  const { Email, Password } = req.body;

  // Validazione dei campi
  if (!Email || !Password) {
    return res.status(400).json({ error: 'Email e password sono obbligatorie' });
  }

  try {
    // Trova l'utente per email
    const utente = await prisma.utente.findUnique({ where: { Email } });
    if (!utente) return res.status(401).json({ error: 'Credenziali non valide' });

    // Confronta la password
    const valid = await bcrypt.compare(Password, utente.Password);
    if (!valid) return res.status(401).json({ error: 'Credenziali non valide' });

    // Genera il token JWT
    const token = jwt.sign(
      { UtenteID: utente.UtenteID, Ruolo: utente.Ruolo, Nome: utente.Nome, Cognome: utente.Cognome },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, utente });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il login' });
  }
};

module.exports = { register, login };
