import { prisma } from "../../lib/prisma";
import {
  IcreatedCommentPayload,
  ICreatedModeratorPayload,
  IUpdatedCommentPayload,
} from "./comment.interface";

const createComment = async (
  authorId: string,
  payload: IcreatedCommentPayload
) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return comment;
};
const getCommentById = async (postId: string) => {
  const comment = await prisma.comment.findMany({
    where: {
      postId,
    },
  });
  return comment;
};
const getCommentByAuthorId = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return comments;
};
const updateComment = async (
  commentId: string,
  data: IUpdatedCommentPayload,
  authorId: string
) => {
  const commontdata = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      post: true,
    },
  });
  if (!commontdata) {
    throw new Error("Your Provided input is invalid!");
  }
  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });
  return updatedComment;
};
const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  const comment = await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
  return comment;
};
const moderateComment = async (id: string, data: ICreatedModeratorPayload) => {
  const commentData = await prisma.comment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!commentData) {
    throw new Error("Comment not found");
  }

  if (commentData.status === data.status) {
    throw new Error(
      `Your provided status (${data.status}) is already up to date`
    );
  }

  const comment = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      status: data.status,
    },
  });

  return comment;
};

export const commnetService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  updateComment,
  deleteComment,
  moderateComment,
};
