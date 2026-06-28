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
const getCommentById = async () => {};
const getCommentByAuthorId = async () => {};
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
