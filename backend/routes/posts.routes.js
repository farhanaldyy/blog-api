import { Router } from 'express';
import { createPost } from '../controllers/posts.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/create', protect, createPost);

export default router;
