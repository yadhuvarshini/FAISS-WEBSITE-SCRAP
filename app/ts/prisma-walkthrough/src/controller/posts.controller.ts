import { Request, Response } from 'express';
import prisma from '../prisma_config/prisma_log';
import { postSchema } from '../schema/posts.schema';
import { Prisma } from '@prisma/client';

export const getPosts = async (req:Request,res:Response) => {
    try{
        // bonus
        // if authorId is provided, filter posts by authorId
        // else return all posts
        // /posts?authorId=1

        //pagination
        // /posts?page=1&limit=5
        const {authorId, page="1", limit="5"} = req.query;
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if(authorId){
            const posts = await prisma.post.findMany({
                where: authorId ? {authorId:Number(authorId)}:{},
                include:{author:true, comments:true},
                skip: (pageNumber - 1) * limitNumber,
                take: limitNumber,
            });
            return res.json({posts})
        }   
        const posts = await prisma.post.findMany({
            include:{
                author:true,
                comments:true,
            }
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "DB query failed"});
    }
}

export const createPost = async (req:Request,res:Response) => {
    try {
    const parsed = postSchema.parse(req.body);

    const {authorId, title, content, published} = req.body;
    const data : Prisma.PostCreateInput = {
        title: parsed.title,
        content: parsed.content,
        published: parsed.published ?? true,
        author:{connect:{id:authorId}}
    };
    const post = await prisma.post.create({data});
    return res.json(post);
    } catch (error) {
        res.status(400).json({error: 'Invalid authorId'});
    }
};

export const deletePost = async(req:Request, res:Response) => {
    try {
        const idParam = req.params.id;
        const postId = Number(idParam);
        if (!idParam || Number.isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid post id' });
        }

        // Ensure post exists before attempting deletion
        const existingPost = await prisma.post.findUnique({ where: { id: postId } });
        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const [deletedComments, deletedPost] = await prisma.$transaction([
            prisma.comment.deleteMany({ where: { postId } }),
            prisma.post.delete({ where: { id: postId } })
        ]);

        return res.json({
            message: 'Post and related comments deleted successfully',
            deletedPostId: deletedPost.id,
            deletedCommentsCount: deletedComments.count
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete post' });
    }
};

export const updatePost = async(req:Request, res:Response) => {
    try {
        const idParam = req.params.id;
        const postId = Number(idParam);
        const {title, content, published} = req.body;
        const data: Prisma.PostUpdateInput = {
            title: title,
            content: content,
            published: published
        }
        const post = await prisma.post.update({where: {id: postId}, data});
        res.json(post);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update post' });
    }
};



