//old file no use only index.cjs

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));


// Session middleware (required for Passport)
app.use(
  session({
    secret: 'bfa377cc789876877ac51aad201bcf9a90eba0a2d1654d4e8076a1c956d40b86',
    resave: false,
    saveUninitialized: true,
  })
);


app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "56119663076-oapcbtntjguq867np9fslgd8p4q94ds5.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try{
        console.log('oAuth Token:', accessToken)
        console.log("Google Profile:", profile);
        done(null, profile); 
      } catch(err){
        console.log(err);
        return done(err,null);
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
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/about" }),
  (req, res) => {
    res.redirect("http://localhost:5173/navbar"); 
  }
);

// Example route to access user data
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user); 
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
    
})
    

