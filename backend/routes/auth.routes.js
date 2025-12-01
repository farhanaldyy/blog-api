import { Router } from 'express';
import { register, login, profile, refresh } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Example protected route
router.get('/profile', protect, profile);

// Refresh token
router.post('/refresh', refresh);

export default router;
