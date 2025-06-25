const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const creaEvento = async (req, res) => {
  const { Titolo, Data, Descrizione } = req.body;
  if (!Titolo || !Data) {
    return res.status(400).json({ error: 'Titolo e Data sono obbligatori' });
  }
  try {
    const evento = await prisma.evento.create({
      data: { Titolo, Data: new Date(Data), Descrizione }
    });
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la creazione dell\'evento' });
  }
};

const aggiornaEvento = async (req, res) => {
  const id = parseInt(req.params.id);
  const { Titolo, Data, Descrizione } = req.body;
  try {
    const evento = await prisma.evento.update({
      where: { EventoID: id },
      data: { Titolo, Data: new Date(Data), Descrizione }
    });
    res.json(evento);
  } catch (error) {
    res.status(404).json({ error: 'Evento non trovato' });
  }
};

const eliminaEvento = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.evento.delete({ where: { EventoID: id } });
    res.json({ message: 'Evento eliminato' });
  } catch (error) {
    res.status(404).json({ error: 'Evento non trovato' });
  }
};

const listaEventi = async (req, res) => {
  try {
    const eventi = await prisma.evento.findMany({ orderBy: { Data: 'asc' } });
    res.json(eventi);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero degli eventi' });
  }
};

const eventiPassatiStat = async (req, res) => {
  const { dal, al } = req.query;

  try {
    const filter = {
      Data: {
        lt: new Date() // eventi già avvenuti
      }
    };

    if (dal) filter.Data.gte = new Date(dal);
    if (al) filter.Data.lte = new Date(al);

    const eventi = await prisma.evento.findMany({
      where: filter,
      include: {
        Iscrizioni: true
      },
      orderBy: { Data: 'desc' }
    });

    const risultato = eventi.map(e => {
      const totale = e.Iscrizioni.length;
      const checkin = e.Iscrizioni.filter(i => i.CheckinEffettuato).length;
      const percentuale = totale > 0 ? ((checkin / totale) * 100).toFixed(1) : '0.0';

      return {
        EventoID: e.EventoID,
        Titolo: e.Titolo,
        Data: e.Data,
        Iscritti: totale,
        Checkin: checkin,
        Partecipazione: `${percentuale}%`
      };
    });

    res.json(risultato);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero delle statistiche' });
  }
};

const listaIscrittiEvento = async (req, res) => {
  const eventoID = parseInt(req.params.id, 10);
  try {
    const iscritti = await prisma.iscrizione.findMany({
      where: { EventoID: eventoID },
      include: { Utente: true }
    });
    res.json(iscritti.map(i => ({
      UtenteID: i.UtenteID,
      Nome: i.Utente?.Nome,
      Cognome: i.Utente?.Cognome,
      Email: i.Utente?.Email,
      Checkin: i.CheckinEffettuato,
      IscrizioneID: i.IscrizioneID
    })));
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero degli iscritti' });
  }
};

module.exports = { creaEvento, aggiornaEvento, eliminaEvento, listaEventi, eventiPassatiStat, listaIscrittiEvento };
