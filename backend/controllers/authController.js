import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/auth_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile:", profile);
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const photo = profile.photos[0]?.value;
        
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            name,
            email,
            googleId: profile.id,
            image: photo,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err);
    done(err, null);
  }
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/about" }),
  (req, res) => {
    res.redirect("http://localhost:5173/navbar");
  }
);

// User Registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User Login
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in /signin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout Route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error logging out");
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Error clearing session");
      }
      res.redirect(process.env.CLIENT_ORIGIN || "/");
    });
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
