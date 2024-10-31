// server/index.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('./db');
const app = express();
const dotenv = require('dotenv');
const sginupMiddleware = require(.middleware/login.js);
const loginMiddleware = require(.middleware/login.js);

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
}));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});



app.use(express.json());
const saltRounds = 10;

app.post('/api/signup',sginupMiddleware (req, res) => {
  const { email, userName, hashedPassword } = req.body;

    const query = 'INSERT INTO user (email, userName, password) VALUES (?, ?, ?)';
  db.query(query, [email, userName, hashedPassword], (err, result) => {
      if (err) {
          console.error('Error inserting user data:', err);
          return res.status(500).json({ success: false, message: 'Sign-in failed' });
      }
      res.json({ success: true, message: 'Sign-in successful' });
    })
});




app.post('/api/login',loginMiddleware (req, res)=>{
  const user = req.user

  const token = jwt.sign({ id: user.id, email: user.email},
    jwtSecret,
    { expiresIn: '7h' })

  res.json({ success: true, token });

});



server.listen(3000, () => {
  console.log('listening on *:3000');
});
