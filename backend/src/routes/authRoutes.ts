import express, { Request, Response } from 'express';
import { validateRegistration, handleValidationErrors } from '../middleware/validateInput';
import { registerUser } from '../controllers/authController';

const router = express.Router();

interface RegisterRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

router.post('/register', validateRegistration, handleValidationErrors, async (req: RegisterRequest, res: Response) => {
  await registerUser(req, res);
});

export default router;
