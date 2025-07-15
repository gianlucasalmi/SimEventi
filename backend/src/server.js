const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authRoutes = require('./routes/authRoutes');
//const eventoRoutes = require('./routes/eventoRoutes');
//const iscrizioneRoutes = require('./routes/iscrizioneRoutes');
const richiesteRoutes = require('./routes/richiesteRoutes');

// Configura variabili d'ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/utenti', authRoutes);
//app.use('/api/eventi', eventoRoutes);
//app.use('/api/iscrizioni', iscrizioneRoutes);
app.use('/api/richieste', richiesteRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});