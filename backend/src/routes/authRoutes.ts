import express, { Request, Response } from 'express';
import { validateRegistration, handleValidationErrors } from '../middleware/validateInput';
import { registerUser, loginUser, refreshAccessToken } from '../controllers/authController';
import UserModel from '../models/UserModel';

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

router.post('/login', async (req: Request, res: Response) => {
  await loginUser(req, res);
});

router.post('/refresh-token', async (req: Request, res: Response) => {
  await refreshAccessToken(req, res);
});

router.get('/logout', async (req, res) => {
  if (req.isAuthenticated()) {
      const userId = req.user.id; 

      await UserModel.updateRefreshToken(userId, null);

      req.logout((err) => {
          if (err) {
              return res.status(500).json({ message: 'Could not log out' });
          }
          res.status(200).json({ message: 'Logged out successfully' });
      });
  } else {
      res.status(401).json({ message: 'Not authenticated' });
  }
});

export default router;
