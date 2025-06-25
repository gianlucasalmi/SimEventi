const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const iscriviUtente = async (req, res) => {
  const utenteID = req.user.UtenteID;
  const { EventoID } = req.body;

  if (!EventoID) {
    return res.status(400).json({ error: 'EventoID obbligatorio' });
  }

  try {
    const evento = await prisma.evento.findUnique({ where: { EventoID } });
    if (!evento) return res.status(404).json({ error: 'Evento non trovato' });

    if (new Date(evento.Data) <= new Date()) {
      return res.status(400).json({ error: 'Iscrizione non consentita: evento già iniziato o concluso' });
    }

    const existing = await prisma.iscrizione.findFirst({
      where: { UtenteID: utenteID, EventoID }
    });
    if (existing) return res.status(409).json({ error: 'Già iscritto all\'evento' });

    const iscrizione = await prisma.iscrizione.create({
      data: { UtenteID: utenteID, EventoID }
    });
    res.status(201).json(iscrizione);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante l\'iscrizione' });
  }
};

const disiscriviUtente = async (req, res) => {
  const utenteID = req.user.UtenteID;
  const id = parseInt(req.params.id);

  try {
    const iscrizione = await prisma.iscrizione.findUnique({ where: { IscrizioneID: id } });
    if (!iscrizione || iscrizione.UtenteID !== utenteID) {
      return res.status(403).json({ error: 'Operazione non autorizzata' });
    }

    const evento = await prisma.evento.findUnique({ where: { EventoID: iscrizione.EventoID } });
    if (new Date(evento.Data) <= new Date()) {
      return res.status(400).json({ error: 'Disiscrizione non consentita: evento già iniziato o concluso' });
    }

    await prisma.iscrizione.delete({ where: { IscrizioneID: id } });
    res.json({ message: 'Disiscrizione effettuata' });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la disiscrizione' });
  }
};

const registraCheckin = async (req, res) => {
  const { IscrizioneID } = req.body;
  if (!IscrizioneID) {
    return res.status(400).json({ error: 'IscrizioneID obbligatorio' });
  }

  try {
    const iscrizione = await prisma.iscrizione.findUnique({
      where: { IscrizioneID }
    });

    if (!iscrizione) {
      return res.status(404).json({ error: 'Iscrizione non trovata' });
    }

    if (iscrizione.CheckinEffettuato) {
      return res.status(400).json({ error: 'Check-in già effettuato' });
    }

    const aggiornamento = await prisma.iscrizione.update({
      where: { IscrizioneID },
      data: {
        CheckinEffettuato: true,
        OraCheckin: new Date()
      }
    });

    res.json({ message: 'Check-in registrato', checkin: aggiornamento });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il check-in' });
  }
};

const listaIscrizioniUtente = async (req, res) => {
  const utenteID = req.user.UtenteID;
  try {
    const iscrizioni = await prisma.iscrizione.findMany({
      where: { UtenteID: utenteID },
      include: { Evento: true }
    });
    // Restituisci anche i dati dell'evento per ogni iscrizione
    res.json(iscrizioni.map(i => ({
      IscrizioneID: i.IscrizioneID, // <--- aggiungi questa riga
      EventoID: i.EventoID,
      Titolo: i.Evento?.Titolo,
      Data: i.Evento?.Data,
      CheckinEffettuato: i.CheckinEffettuato
    })));
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero delle iscrizioni' });
  }
};

module.exports = {
  iscriviUtente,
  disiscriviUtente,
  registraCheckin,
  listaIscrizioniUtente
};