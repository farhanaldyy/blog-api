import { Router } from 'express';
import { readUsers, readUserById, updateUser, deletedUser } from '../controllers/user.controller.js';

const router = Router();

// router.post('/', createUser); // dialihkan ke register auth
router.get('/', readUsers);
router.get('/:id', readUserById);
router.put('/:id', updateUser);
router.delete('/:id', deletedUser);

export default router;
