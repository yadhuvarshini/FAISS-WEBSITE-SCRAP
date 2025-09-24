import { z } from 'zod';

export const commentSchema = z.object({
    text: z.string().min(1, "Comments are missing"),
    postId: z.number().int(),
})