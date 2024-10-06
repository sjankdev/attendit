const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegistration,
    handleValidationErrors,
};
