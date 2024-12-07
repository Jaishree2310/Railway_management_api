const express = require('express');
const TrainController = require('../controllers/trainController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authenticateAdmin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/', authenticateAdmin, TrainController.addTrain);
router.get('/availability', authenticateUser, TrainController.getTrainAvailability);

module.exports = router;