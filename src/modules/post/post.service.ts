import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};
const getAllPost = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};
const getPostsStats = async () => {};
const getMyPost = async (authorId:string) => {
    const myPosts =await prisma.post.findMany({
      where:{
        authorId
      },
      orderBy:{
        createdAt:"desc"
      },
      include:{
        author:{
          omit:{
            password:true
          }
        },
        _count:{
          select:{
            comments:true
          }
        }
      }
    })
    return myPosts;
};
const getPostById = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatePost = await prisma.post.update({
    where: {
      id: postId,
    },
    data:{
      views:{
        increment:1
      }
    },
    include:{
      author:{
        omit:{
          password:true
        }
      },
      comments:true
    }
  });
  return updatePost;
};
const updatePost = async () => {};
const deletePost = async () => {};

export const postService = {
  createPost,
  getAllPost,
  getMyPost,
  getPostById,
  getPostsStats,
  updatePost,
  deletePost,
};
