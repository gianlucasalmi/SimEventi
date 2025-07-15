const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', verifyToken, async (req, res) => {
  const { Oggetto, Quantità, CostoUnitario, Motivazione, CategoriaID } = req.body;
  const utenteID = req.user.UtenteID;

  try {
    const nuovaRichiesta = await prisma.richiestaAcquisto.create({
      data: {
        Oggetto,
        Quantità,
        CostoUnitario,
        Motivazione,
        Stato: 'In attesa',
        CategoriaID,
        UtenteID: utenteID,
      },
    });
    res.status(201).json(nuovaRichiesta);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la creazione della richiesta' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    let richieste;
    if (req.user.Ruolo === 'Responsabile') {
      richieste = await prisma.richiestaAcquisto.findMany();
    } else {
      richieste = await prisma.richiestaAcquisto.findMany({
        where: { UtenteID: req.user.UtenteID }
      });
    }
    res.json(richieste);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero delle richieste' });
  }
});

module.exports = router;