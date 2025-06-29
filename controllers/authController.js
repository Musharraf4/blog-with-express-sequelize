const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../db/models');
require('dotenv').config();

exports.register = async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, firstName, lastName });
    res.status(201).json({message:"User Registered Successfully"});
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ UserId: user.id }, process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    res.json({ data: { token, username } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};