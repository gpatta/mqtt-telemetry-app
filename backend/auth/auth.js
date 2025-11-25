import express from 'express';

const router = express.Router();
import { registerUser, loginUser, getProfile } from './authController.js';
import { protect } from './authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

export default router;