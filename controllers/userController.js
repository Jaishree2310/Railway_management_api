// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { JWT_SECRET, TOKEN_EXPIRY } = require('../config/constants');

class UserController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const userId = await UserModel.create(username, email, hashedPassword);
      
      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: TOKEN_EXPIRY }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
}

module.exports = UserController;
