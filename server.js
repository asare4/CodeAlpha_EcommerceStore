const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log("DB Error:", err));

// Simple User Schema (for login/register)
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String
}));

// Routes
app.get('/api/products', (req, res) => {
  const fs = require('fs');
  const products = JSON.parse(fs.readFileSync('products.json'));
  res.json(products);
});

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  res.json({ success: true, message: "Registered!" });
});

// Login 
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, user: { name: user.name } });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Open this → http://localhost:${PORT}`);
});