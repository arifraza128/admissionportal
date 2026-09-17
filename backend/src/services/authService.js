import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  };
  const secret = process.env.JWT_SECRET || 'university_secret_key';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const registerUser = async ({ name, email, password, role, department }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists.');
    error.statusCode = 400;
    throw error;
  }

  const user = new User({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'STUDENT',
    department: department || 'Computer Science & Engineering',
    studentId: (role || 'STUDENT') === 'STUDENT' ? `STU-${Date.now().toString().slice(-4)}` : undefined,
  });

  await user.save();
  const token = generateToken(user);

  return {
    token,
    user: user.toJSON(),
    message: 'User registration successful',
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    token,
    user: user.toJSON(),
  };
};

export default {
  generateToken,
  registerUser,
  loginUser,
};
