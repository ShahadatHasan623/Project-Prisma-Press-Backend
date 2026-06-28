import { prisma } from "../../lib/prisma";
import { IcreatedCommentPayload } from "./comment.interface";

const createComment = async (authorId:string,payload:IcreatedCommentPayload) => {

  await prisma.post.findUniqueOrThrow({
    where:{
      id: payload.postId
    }
  })

  const comment =await prisma.comment.create({
     data: {
      ...payload,
      authorId
    }
  })

  return comment

};
const getCommentById = async (commetnId:string) => {
    const comment =await prisma.comment.findMany({
      where:{
        id:commetnId
      }
    })
    return comment
};
const getCommentByAuthorId = async (authorId:string) => {
   const comments =await prisma.comment.findMany({
    where:{
      authorId
    },
    orderBy:{
      createdAt:"desc"
    },
    include:{
      post:{
        select:{
          id:true,
          title:true
        }
      }
    }
   })
   return comments
};
const updateComment = async () => {};
const deleteComment = async () => {};
const moderateCommen = async () => {};

export const commnetService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  updateComment,
  deleteComment,
  moderateCommen,
};
