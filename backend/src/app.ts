import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/authRoutes";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User as UserModelInterface } from "./models/User";
import UserModel from "./models/UserModel";
import { signToken, signRefreshToken } from "./utils/jwtHelper";
import JwtTokenModel from "./models/JwtTokenModel";
import ParticipantModel from "./models/ParticipantModel";
import AdminModel from "./models/AdminModel";
import { GoogleUser } from "./models/GoogleUser";

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(
  session({
    secret: "01628b90ce3680876d820a4c60e62d8a",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: UserModelInterface, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    done(error, null);
  }
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await UserModel.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"), false);
        }

        let user = await UserModel.findByEmail(email);
        if (!user) {
          user = await UserModel.create(
            profile.name?.givenName || "",
            profile.name?.familyName || "",
            email,
            "",
            "participant",
            null
          );

          await UserModel.setVerified(user.id);
          await ParticipantModel.create(user.id);
        } else {
          await UserModel.setVerified(user.id);
        }

        const googleUser: GoogleUser = { ...user, firstTime: !user.roleChosen };

        if (!user.roleChosen) {
          return done(null, googleUser);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

app.use("/api/auth", authRoutes);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user as any;
    const payload = { id: user.id, email: user.email, role: user.role };

    const token = signToken(payload, "1h");
    const refreshToken = signRefreshToken(payload, "7d");

    await JwtTokenModel.updateRefreshToken(user.id, token, refreshToken);

    const redirectUrl = `http://localhost:3000/select-role?userId=${
      user.id
    }&firstTime=${!user.roleChosen}`;
    res.redirect(redirectUrl);
  }
);

const roleSelectionRouter = Router();

roleSelectionRouter.post("/select-role", async (req, res) => {
  const { userId, role, dob } = req.body;

  try {
    if (!userId || !role || !dob) {
      return res
        .status(400)
        .json({ message: "User ID, role, and DOB are required" });
    }

    const exists = await UserModel.userExists(userId);
    if (!exists) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.updateRole(userId, role);

    await UserModel.updateDOB(userId, dob);

    await UserModel.setRoleChosen(userId);

    if (role === "admin") {
      const adminEntryExists = await AdminModel.findByUserId(userId);
      if (!adminEntryExists) {
        await AdminModel.create(userId);
      }
      await ParticipantModel.deleteByUserId(userId);
    } else {
      const participantEntryExists = await ParticipantModel.findByUserId(
        userId
      );
      if (!participantEntryExists) {
        await ParticipantModel.create(userId);
      }
    }

    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role" });
  }
});

app.use("/api/auth", roleSelectionRouter);

export default app;
