const express = require('express');
const { validateRegistration, handleValidationErrors } = require('../middleware/validateInput');
const { registerUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', validateRegistration, handleValidationErrors, registerUser);

module.exports = router;
