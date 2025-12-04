import { Router } from 'express';
import { createPost } from '../controllers/posts.controller.js';
import { protect } from '../middleware/auth.js';
import { isAuthor } from '../middleware/isAuthor.js';

const router = Router();

router.post('/create', protect, isAuthor({ requireRole: ['author', 'admin'] }), createPost);

export default router;
