const express = require('express');
const { detectDamage } = require('../controllers/detectionController');
const { protect } = require('../utils/authMiddleware');
const router = express.Router();

router.post('/detect', protect, detectDamage);

module.exports = router;
