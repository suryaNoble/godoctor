// import express from "express";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import session from "express-session";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import bodyParser from "body-parser";
// import pkg from "pg";
// const { Pool } = pkg;
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(bodyParser.json());

// const pool = new Pool({
//   user: process.env.DB_USER || "postgres",
//   host: process.env.DB_HOST || "localhost",
//   database: process.env.DB_NAME || "crud",
//   password: process.env.DB_PASSWORD || "Noble11121",
//   port: process.env.DB_PORT || 5432,
// });

// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
//     credentials: true,
//   })
// );

// // Session Middleware (Secure in production)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "bfa377cc789876877ac51aad201bcf9a90eba0a2d1654d4e8076a1c956d40b86",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID || "56119663076-oapcbtntjguq867np9fslgd8p4q94ds5.apps.googleusercontent.com",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
//       callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         console.log("oAuth Token:", accessToken);
//         console.log("Google Profile:", profile);

//         const email = profile.emails[0].value;
//         const name = profile.displayName;
//         const photo = profile.photos[0]?.value;

//         const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//         if (existingUser.rows.length > 0) {
//           console.log("User found:", existingUser.rows[0]);
//           return done(null, existingUser.rows[0]);
//         }

//         const query =
//           "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *;";
//         const newUser = await pool.query(query, [name, email, accessToken]);

//         console.log("New user created:", newUser.rows[0]);
//         return done(null, newUser.rows[0]);
//       } catch (err) {
//         console.error("Error in Google Strategy:", err);
//         return done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
//     done(null, user.rows[0]);
//   } catch (err) {
//     console.error("Error in deserializeUser:", err);
//     done(err, null);
//   }
// });

// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
//   })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "http://localhost:5173/about" }),
//   (req, res) => {
//     res.redirect("http://localhost:5173/navbar");
//   }
// );

// // Registration Route
// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await pool.query(
//       "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
//       [name, email, hashedPassword]
//     );

//     const token = jwt.sign(
//       { id: newUser.rows[0].id, email },
//       process.env.JWT_SECRET || "bfa377cc789876877ac51aad201bcf9a90eba0a2d1654d4e8076a1c956d40b86"
//     );

//     res.status(201).json({ message: "User registered successfully", token });
//   } catch (err) {
//     console.error("Error in /register:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Login Route
// app.post("/signin", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (user.rows.length === 0) {
//       return res.status(400).json({ message: "User does not exist" });
//     }

//     const validPassword = await bcrypt.compare(password, user.rows[0].password);
//     if (!validPassword) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user.rows[0].id, email },
//       process.env.JWT_SECRET || "bfa377cc789876877ac51aad201bcf9a90eba0a2d1654d4e8076a1c956d40b86"
//     );

//     res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     console.error("Error in /signin:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// // Protected Profile Route
// app.get("/profile", (req, res) => {
//   try {
//     if (!req.isAuthenticated()) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }
//     res.json(req.user);
//   } catch (err) {
//     console.error("Error in /profile:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Logout Route
// app.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.error("Error during logout:", err);
//       return res.status(500).send("Error logging out");
//     }
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Error destroying session:", err);
//         return res.status(500).send("Error clearing session");
//       }
//       res.redirect(process.env.CLIENT_ORIGIN || "/");
//     });
//   });
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error("Server Error:", err);
//   res.status(500).send("Internal Server Error");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





// THE ABOVE CODE WORKS PRFECTLY FINE, BUT I WILL BE USING THE BELOW CODE FOR THE MERN BACKEND CONNECTION INSTEAD OF POSTGRESQL 
//also be commonly called as server.js


import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import cors from "cors";
import path from 'path'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: 'bfa377cc789876877ac51aad201bcf9a90eba0a2d1654d4e8076a1c956d40b86',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

// Passport Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "56119663076-oapcbtntjguq867np9fslgd8p4q94ds5.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
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
          password: null, // No password since it's Google OAuth
        });
        await user.save();
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.redirect(`http://localhost:5173?token=${token}`);
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


