import { Router } from 'express';
import { createComment } from '../controller/comments.controller';
import { deleteComment } from '../controller/comments.controller';
import { updateComment } from '../controller/comments.controller';
import { authMiddleware } from '../middleware/auth';
const router = Router();

router.post('/', authMiddleware, createComment);
router.delete('/:id', authMiddleware, deleteComment);
router.put('/:id', authMiddleware, updateComment);

export default router;