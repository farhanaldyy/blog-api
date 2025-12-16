import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/handleUpload.js';
import { addProfile, editProfile, readProfile } from '../controllers/user.controller.js';

const router = Router();

// router.post('/', createUser); // dialihkan ke register auth
// router.get('/:id', readUserById);
// router.put('/:id', updateUser);
// router.delete('/:id', deletedUser);

router.get('/', protect, readProfile);
router.post('/', protect, addProfile); // without image
router.put('/', protect, uploadSingle('avatar'), editProfile);

export default router;
