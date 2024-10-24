import express, { Request, Response } from "express";
import {
  validateRegistration,
  handleValidationErrors,
} from "../middleware/validateInput";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../controllers/authController";
import UserModel from "../models/UserModel";
import { resendVerificationEmail } from "../controllers/authController";
import JwtTokenModel from "../models/JwtTokenModel";
import { authenticateJWT } from "../utils/jwtHelper";
const router = express.Router();

interface RegisterRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  async (req: RegisterRequest, res: Response) => {
    await registerUser(req, res);
  }
);

router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    const exists = await UserModel.emailExists(email);
    return res.json({ exists });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  await loginUser(req, res);
});

router.post("/refresh-token", async (req: Request, res: Response) => {
  await refreshAccessToken(req, res);
});

router.get("/verify", async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }

  try {
    const user = await UserModel.findByVerificationToken(token as string);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or token is invalid" });
    }

    await UserModel.verifyUser(user.id);
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/roles", authenticateJWT, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const roles = await UserModel.getUserRoles(userId);
    res.json({ roles });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/resend-verification", resendVerificationEmail);

router.get("/logout", async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;

    await JwtTokenModel.updateRefreshToken(userId, null, null);

    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;

  console.log("Password reset request received for email:", email);

  const result = await UserModel.requestPasswordReset(email);
  if (result === null) {
    console.log("Email not found:", email);
    return res.status(404).send("Email not found");
  }

  console.log("Password reset link sent to email:", email);
  res.send("Password reset link sent to your email.");
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const success = await UserModel.resetPassword(token, newPassword);
  if (!success) {
    return res.status(400).send("Invalid or expired token");
  }
  res.send("Password reset successfully");
});

export default router;
