import express, { Request, Response } from 'express';
import { validateRegistration, handleValidationErrors } from '../middleware/validateInput';
import { registerUser, loginUser, refreshAccessToken } from '../controllers/authController';
import UserModel from '../models/UserModel';
import { resendVerificationEmail } from '../controllers/authController';
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

router.get('/verify', async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  try {
    const user = await UserModel.findByVerificationToken(token as string);
    if (!user) {
      return res.status(404).json({ message: 'User not found or token is invalid' });
    }

    await UserModel.verifyUser(user.id);
    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/resend-verification', resendVerificationEmail);

router.get('/logout', async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;

    await UserModel.updateRefreshToken(userId, null);
    await UserModel.revokeRefreshToken(userId);

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
