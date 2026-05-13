const router = require('express').Router();
const { getUserStatus, getInstruments, getInstrumentDetail, getDashboardSummary } = require('../../../controllers/userController');

// placeholder for user middleware (auth, rate limit etc.)
// router.use(userAuth);

router.get('/', getUserStatus);
router.get('/dashboard', getDashboardSummary);
router.get('/instruments', getInstruments);
router.get('/instruments/:id', getInstrumentDetail);

module.exports = router;
