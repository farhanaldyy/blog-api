import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/handleUpload.js';
import { addProfile } from '../controllers/user.controller.js';

const router = Router();

// router.post('/', createUser); // dialihkan ke register auth
// router.get('/:id', readUserById);
// router.put('/:id', updateUser);
// router.delete('/:id', deletedUser);

// router.post('/', protect, uploadSingle('coverImage'), addProfile); with image
router.post('/', protect, addProfile); // without image

export default router;
