
//once used for google auth now shofted to index.js #nouse

// const pool = require('../db/index.cjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crud',
    password:"Noble11121",
    port: 5432,
});

const handleGoogleCallback = async (req, res) => {
  try {
    const user = req.user; // Retrieved by Passport.js after successful Google OAuth
    const { mode } = req.query; // login or register

    // Extracting relevant fields from the user object
    const email = user.emails[0].value;
    const name = user.displayName;
    const photo = user.photos[0].value;

    // Check if the user already exists in the database
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      if (mode === 'register') {
        return res.status(400).json({ message: 'User already registered' });
      }
      // Generate a JWT token for the existing user
      const token = jwt.sign({ id: existingUser.rows[0].id }, 'our_anonymous_any_key');
      return res.json({ token, user: existingUser.rows[0] });
    } else {
      if (mode === 'login') {
        return res.status(404).json({ message: 'User not registered' });
      }
      // Insert new user into the database
      const newUser = await pool.query(
        'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
        [name, email, 99]
      );

      // Generate a JWT token for the new user
      const token = jwt.sign({ id: newUser.rows[0].id }, 'our_anonymous_any_key');
      return res.json({ token, user: newUser.rows[0] });
    }
  } catch (error) {
    console.error('Error during Google authentication callback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { handleGoogleCallback };
