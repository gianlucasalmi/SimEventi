const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');
const { onlyOrganizzatore } = require('../middlewares/roleMiddleware');
const {creaEvento, aggiornaEvento, eliminaEvento, listaEventi, listaIscrittiEvento} = require('../controllers/eventoController');
const { eventiPassatiStat } = require('../controllers/eventoController');

router.get('/', verifyToken, listaEventi);
router.post('/', verifyToken, onlyOrganizzatore, creaEvento);
router.put('/:id', verifyToken, onlyOrganizzatore, aggiornaEvento);
router.delete('/:id', verifyToken, onlyOrganizzatore, eliminaEvento);
router.get('/statistiche', verifyToken, onlyOrganizzatore, eventiPassatiStat);
router.get('/:id/iscritti', verifyToken, onlyOrganizzatore, listaIscrittiEvento);

module.exports = router;
