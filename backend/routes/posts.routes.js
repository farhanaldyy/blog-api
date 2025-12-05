import { Router } from 'express';
import { createPost, deletePost, updatePost } from '../controllers/posts.controller.js';
import { protect } from '../middleware/auth.js';
import { isAuthor } from '../middleware/isAuthor.js';
import { uploadSingle, uploadMultiple } from '../middleware/handleUpload.js';

const router = Router();

router.post('/', protect, isAuthor({ requireRole: ['author', 'admin'] }), uploadSingle('coverImage'), createPost);

router.put('/:id', protect, isAuthor({ ownerShip: true }), uploadSingle('coverImage'), updatePost);

router.delete('/:id', protect, isAuthor({ ownerShip: true }), deletePost);

export default router;
