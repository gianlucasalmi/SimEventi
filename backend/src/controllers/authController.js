const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { Nome, Cognome, Email, Password, Ruolo } = req.body;
  if (!Nome || !Cognome || !Email || !Password || !Ruolo) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  if (!['Dipendente', 'Organizzatore'].includes(Ruolo)) {
    return res.status(400).json({ error: 'Ruolo non valido. Deve essere Dipendente o Organizzatore' });
  }

  try {
    const existing = await prisma.utente.findUnique({ where: { Email } });
    if (existing) return res.status(409).json({ error: 'Email già registrata' });

    const hashedPassword = await bcrypt.hash(Password, 10);
    const nuovoUtente = await prisma.utente.create({
      data: {
        Nome,
        Cognome,
        Email,
        Password: hashedPassword,
        Ruolo
      }
    });
    res.status(201).json({ message: 'Registrazione avvenuta con successo' });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};

const login = async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({ error: 'Email e password sono obbligatorie' });
  }
  try {
    const utente = await prisma.utente.findUnique({ where: { Email } });
    if (!utente) return res.status(401).json({ error: 'Credenziali non valide' });

    const valid = await bcrypt.compare(Password, utente.Password);
    if (!valid) return res.status(401).json({ error: 'Credenziali non valide' });

    const token = jwt.sign(
      { UtenteID: utente.UtenteID, Ruolo: utente.Ruolo, Nome: utente.Nome, Cognome: utente.Cognome },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il login' });
  }
};

module.exports = { register, login };
