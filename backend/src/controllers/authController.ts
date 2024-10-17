import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel";
import JwtTokenModel from "../models/JwtTokenModel";
import EmailVerificationModel from "../models/EmailVerificationModel";
import {
  signToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtHelper";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../utils/mailer";
import ParticipantModel from "../models/ParticipantModel";
import AdminModel from "../models/AdminModel";

const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = "participant",
    dob,
  } = req.body;

  try {
    const existingUserByEmail = await UserModel.findByEmail(email);
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create(
      firstName,
      lastName,
      email,
      hashedPassword,
      role,
      dob
    );

    await UserModel.setRoleChosen(user.id);

    if (role === "participant") {
      await ParticipantModel.create(user.id);
    } else if (role === "admin") {
      await AdminModel.create(user.id);
    }

    const verificationToken = uuidv4();
    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );
    await EmailVerificationModel.create(
      user.id,
      verificationToken,
      verificationTokenExpiresAt
    );

    await sendVerificationEmail(email, verificationToken);

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
};

const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email } = req.body;

  try {
    const user = await UserModel.findByEmail(email);
    if (!user || user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User not found or already verified.",
      });
    }

    const verificationToken = uuidv4();
    await EmailVerificationModel.updateToken(user.id, verificationToken);
    await sendVerificationEmail(email, verificationToken);

    return res.status(200).json({
      success: true,
      message: "Verification email resent successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: (error as Error).message,
    });
  }
};

const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  const user = await UserModel.findByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message:
        "Account not verified. Please check your email for verification instructions.",
    });
  }

  if (await bcrypt.compare(password, user.password)) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = signToken(payload, "1h");
    const refreshToken = signRefreshToken(payload, "7d");

    await JwtTokenModel.create(user.id, token, refreshToken);

    return res.json({ token, refreshToken });
  }

  return res.status(401).json({ message: "Invalid email or password" });
};

const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as { id: number };

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found or refresh token is invalid" });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = signToken(payload, "1h");
    const newRefreshToken = signRefreshToken(payload, "7d");

    await JwtTokenModel.update(user.id, newAccessToken, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.json({ token: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: (error as Error).message });
  }
};

export { registerUser, loginUser, refreshAccessToken, resendVerificationEmail };
