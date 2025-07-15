const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.post('/', verifyToken, async (req, res) => {
  const { Oggetto, Quantità, CostoUnitario, Motivazione, Categoria } = req.body;
  const utenteID = req.user.UtenteID;

  // Validazione dei campi
  if (!Oggetto || !Quantità || !CostoUnitario || !Motivazione || !Categoria) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  try {
    const nuovaRichiesta = await prisma.richiestaAcquisto.create({
      data: {
        Oggetto,
        Quantità,
        CostoUnitario,
        Motivazione,
        Stato: 'In attesa',
        Categoria,
        UtenteID: utenteID,
      },
    });
    res.status(201).json(nuovaRichiesta);
  } catch (error) {
    console.error('Errore POST richieste:', error);
    res.status(500).json({ error: 'Errore durante la creazione della richiesta' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    console.log("Decoded user from token:", req.user);
    const { UtenteID, Ruolo } = req.user;

    if (!UtenteID) {
      throw new Error("UtenteID mancante nel token");
    }

    let richieste;
    if (Ruolo === 'Responsabile') {
      richieste = await prisma.richiestaAcquisto.findMany();
    } else {
      richieste = await prisma.richiestaAcquisto.findMany({
        where: { UtenteID }
      });
    }

    res.json(richieste);
  } catch (error) {
    console.error('Errore backend richieste:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle richieste' });
  }
});

module.exports = router;