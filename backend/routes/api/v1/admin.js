const router = require('express').Router();
const { getAdminStatus, createInstrument, listInstruments, getInstrument } = require('../../../controllers/adminController');

// placeholder for admin middleware (auth, role check etc.)
// router.use(adminAuth);

router.get('/', getAdminStatus);
router.post('/instruments', createInstrument);
router.get('/instruments', listInstruments);
router.get('/instruments/:id', getInstrument);

module.exports = router;
