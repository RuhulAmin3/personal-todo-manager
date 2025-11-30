import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readJSONFile, writeJSONFile } from '../utils/fileUtils.js';
import { generateToken } from '../middleware/auth.js';

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await readJSONFile('user.json');

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeJSONFile('user.json', users);

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await readJSONFile('user.json');
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/auth/profile
export const profile = (req, res) => {
  return res.json({
    success: true,
    user: { id: req.user.id, username: req.user.username },
  });
};

// POST /api/auth/logout
export const logout = (_req, res) => {
  return res.json({ success: true, message: 'Logout successful' });
};