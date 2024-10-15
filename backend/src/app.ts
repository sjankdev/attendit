import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User as UserModelInterface } from './models/User';
import UserModel from './models/UserModel';
import { signToken, signRefreshToken } from './utils/jwtHelper';
import JwtTokenModel from './models/JwtTokenModel';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(session({
  secret: '01628b90ce3680876d820a4c60e62d8a',
  resave: false,
  saveUninitialized: true,
}));

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
      done(new Error('User not found'), null);
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
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'), false);
        }

        let user = await UserModel.findByEmail(email);
        if (!user) {
          user = await UserModel.create(
            profile.name?.givenName || '',
            profile.name?.familyName || '',
            email,
            '',
            'participant'
          );
        }

        await UserModel.setVerified(user.id);

        return done(null, user);

      } catch (error) {
        return done(error);
      }
    }
  )
);

app.use('/api/auth', authRoutes);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    const user = req.user as any;
    const payload = { id: user.id, email: user.email, role: user.role };

    const token = signToken(payload, '1h');
    const refreshToken = signRefreshToken(payload, '7d');

    await JwtTokenModel.updateRefreshToken(user.id, token, refreshToken);

    console.log('Redirecting to:', `http://localhost:3000/home?token=${token}&refreshToken=${refreshToken}`);
    res.redirect(`http://localhost:3000/home?token=${token}&refreshToken=${refreshToken}`);
  }
);

export default app;
