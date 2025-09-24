import { Router } from 'express';
import { createUser, getUsers, deleteUser, updateUser } from '../controller/users.controller';
import { authMiddleware } from '../middleware/auth';
const router = Router();

router.get('/', getUsers);
router.post('/', createUser )
router.delete('/:id', authMiddleware, deleteUser);
router.put('/:id', authMiddleware, updateUser);

export default router;