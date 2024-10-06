import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validateRegistration = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; 
    }
    next(); 
};


export {
    validateRegistration,
    handleValidationErrors,
};
