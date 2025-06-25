const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/jwt');
const { iscriviUtente, disiscriviUtente, listaIscrizioniUtente } = require('../controllers/iscrizioneController');
const { onlyOrganizzatore } = require('../middlewares/roleMiddleware');
const { registraCheckin } = require('../controllers/iscrizioneController');


router.post('/', verifyToken, iscriviUtente);
router.delete('/:id', verifyToken, disiscriviUtente);
router.get('/', verifyToken, listaIscrizioniUtente);
router.post('/checkin', verifyToken, onlyOrganizzatore, registraCheckin);


module.exports = router;
