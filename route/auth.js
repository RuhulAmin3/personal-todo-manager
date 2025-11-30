import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { userSignupSchema, userLoginSchema } from '../validation/schemas.js';
import { signup, login, profile, logout } from '../controller/authController.js';

const router = express.Router();
// User registration
router.post('/signup', validateBody(userSignupSchema), signup);

// User login
router.post('/login', validateBody(userLoginSchema), login);

// Get user profile
router.get('/profile', authenticateToken, profile);

// Logout (client should remove token)
router.post('/logout', authenticateToken, logout);

export default router;