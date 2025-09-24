import { Router } from 'express';
import { getPosts } from '../controller/posts.controller';
import { createPost } from '../controller/posts.controller';
import { deletePost } from '../controller/posts.controller';
import { updatePost } from '../controller/posts.controller';
import { authMiddleware as auth } from '../middleware/auth';

const router = Router();

router.get('/', getPosts);
router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost);
router.put('/:id', auth,updatePost);

export default router;