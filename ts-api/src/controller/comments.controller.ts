import { Request, Response } from 'express';
import prisma from '../prisma_config/prisma_log';
import { commentSchema } from '../schema/comments.schema';
import { Prisma } from '@prisma/client';

export const createComment = async (req:Request, res:Response) => {
    try {
    const parsed = commentSchema.parse(req.body);
    const {postId, text} = req.body;
    const data: Prisma.CommentCreateInput = {
        text: parsed.text,
        post: {connect:{id:postId}}
    }
    const comment = await prisma.comment.create({data});
    return res.json(comment);
    } catch (error) {
        res.status(400).json({error: 'Invalid postId'});
    }
}

export const deleteComment = async(req:Request, res:Response) => {
    try {
        const idParam = req.params.id;
        const commentId = Number(idParam);
        if (!idParam || Number.isNaN(commentId)) {
            return res.status(400).json({ error: 'Invalid comment id' });
        }
        const data: Prisma.CommentDeleteArgs = {
            where:{ id: commentId }
        }
        const comment = await prisma.comment.delete(data);
        return res.json(comment);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete comment' });
    }
};

export const updateComment = async(req:Request, res:Response) => {
    try {
        const idParam = req.params.id;
        const commentId = Number(idParam);
        const {text} = req.body;
        const data: Prisma.CommentUpdateInput = {
            text: text
        }
        const comment = await prisma.comment.update({where: {id: commentId}, data});
        res.json(comment);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update comment' });
    }
}