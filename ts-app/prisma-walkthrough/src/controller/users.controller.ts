import { Request, Response } from 'express';
import prisma from '../prisma_config/prisma_log';
import { Prisma } from '@prisma/client';
import { signToken } from '../utils/jwt';

export const getUsers = async (req:Request,res:Response) => {
    try {
    const users = await prisma.user.findMany(); // no includes
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
}

export const deleteUser = async(req:Request, res:Response) => {
    try {
        const idParam = req.params.id;
        const userId = Number(idParam);
        if(!idParam || Number.isNaN(userId)){
            return res.status(400).json({ error: 'Invalid user id' });
        }
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        if(!existingUser){
            return res.status(404).json({ error: 'User not found' });
        }
        const [deletedComments, deletedPosts, deletedUser] = await prisma.$transaction([
            // Delete comments on posts authored by the user first to satisfy FK constraints
            prisma.comment.deleteMany({ where: { post: { authorId: userId } } }),
            // Then delete the user's posts
            prisma.post.deleteMany({ where: { authorId: userId } }),
            // Finally delete the user
            prisma.user.delete({ where: { id: userId } })
        ]);

        return res.json({
            message: 'User and related posts deleted successfully',
            deletedUserName: deletedUser.name,
            deletedUserId: deletedUser.id,
            deletedPostsCount: deletedPosts.count,
            deletedCommentsCount: deletedComments.count
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete user' });
    }
}

export const updateUser = async(req:Request, res:Response) => {
    try {
        const idParam = req.params.id;
        const userId = Number(idParam);
        const {name, email} = req.body;
        const data: Prisma.UserUpdateInput = {
            name: name,
            email: email
        }
        const user = await prisma.user.update({where: {id: userId}, data});
        res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update user' });
    }
}

export const createUser = async(req:Request, res:Response) =>{
    const {name, email} = req.body
    try {
        const user = await prisma.user.create({
            data:{name, email}
        });

        const token = signToken({userId: user.id, email:user.email})
        res.status(201).json({user:{id:user.id, name:user.name, email:user.email}, token})
    } catch(err:any){
        res.status(400).json({error:"User already exist"})
    }``
}
