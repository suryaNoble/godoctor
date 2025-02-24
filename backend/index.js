import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import cors from "cors";
import path from 'path'
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import 'dotenv/config'

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoutes.js";
import userModel from "./models/userModel.js";

import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
connectCloudinary()

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(cors());
app.use(cors({
  origin: ['https://godoctor-admin.onrender.com','https://godoctor-frontend.onrender.com','http://localhost:5173','http://localhost:5174'], 
  methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  credentials: true, // Allow cookies if needed
}));
app.use(
  session({
    secret: 'bfa377cc789876877ac51aad201bcf9a90eba0a2d1654d4e8076a1c956d40b86',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());


app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

// Passport Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "56119663076-oapcbtntjguq867np9fslgd8p4q94ds5.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({ googleId: profile.id });

        // If user doesn't exist, check if there's an existing account with the same email
        if (!user) {
          user = await userModel.findOne({ email: profile.emails[0].value });

          if (!user) {
            // If no user exists with this email, create a new one
            user = new userModel({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              image: profile.photos[0].value, // Store profile picture URL from Google
            });

            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user (for session support)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt:'select_account' })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  async (req, res) => {
    try {
      const { id, displayName, emails } = req.user;
      const email = emails[0].value;

      let user = await userModel.findOne({ email });

      if (!user) {
        // Register new Google user
        user = new userModel({
          googleId: id,
          name: displayName,
          email,
          password: null, 
        });
        await user.save();
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${FRONTEND_URL}?token=${token}`);
          } catch (error) {
      console.error("Google Auth Error:", error);
      res.redirect("http://localhost:5173/login");
    }
  }
);


app.get("/api/user/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




app.use('/api/admin',adminRouter)
//localhost/5000/api/admin/add-doctor because add-doctor is mounted in adminRouter.js in routes and addDoctor will be executed which is an api controller in adminController.js which is mounted in adminRoute

app.use('/api/doctor',doctorRouter)

app.use('/api/user',userRouter)


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});


