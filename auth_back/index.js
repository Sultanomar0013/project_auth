// server/index.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const db = require('./db');
const app = express();
const dotenv = require('dotenv');


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


app.post('/api/signup', (req, res) => {
  const { email, userName, password } = req.body;

  if (!email || !userName || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  bcrypt.hash(password, saltRounds, (err, hashedPassword) =>{
    if(err){
      console.error('Error When Hasheing', err);
      return res.status(500).json({success:false, message: 'Sign-in failed' });
    }

    const query = 'INSERT INTO user (email, userName, password) VALUES (?, ?, ?)';
  db.query(query, [email, userName, hashedPassword], (err, result) => {
      if (err) {
          console.error('Error inserting user data:', err);
          return res.status(500).json({ success: false, message: 'Sign-in failed' });
      }
      res.json({ success: true, message: 'Sign-in successful' });
    })
  });
});




app.post('/api/login', (req, res)=>{
  const { email, password} = req.body;

  const queryLogin = 'SELECT * FROM user where email = ?';
  db.query(queryLogin, [email], (err, results) =>{
    if(err){
      console.error('ERROR WHEN RETRIVE PASS', err);
      return res.status(500).json({success:false, message: 'Login failed' });
    }
    if(results.length === 0 ){
      return res.status(400).json({ success: false, message : 'user not found' });
    }

    const user = results[0];
    const hashedPassword = results[0].password;

    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ success: false, message: 'Login failed' });
            }

            if (isMatch) {
                const token = jwt.sign({ id: user.id, email: user.email, password: user.password }, jwtSecret, { expiresIn: '7h' });
                res.json({ success: true, token });
            } else {
                res.status(400).json({ success: false, message: 'Incorrect password' });
            }
    });
  })
})


server.listen(3000, () => {
  console.log('listening on *:3000');
});
