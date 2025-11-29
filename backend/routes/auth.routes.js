import { Router } from 'express';
import { register, login, profile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import {
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  setRefreshCookie,
} from '../utils/tokens.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Example protected route
router.get('/profile', protect, profile);

export default router;
