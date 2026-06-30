import { title } from "node:process";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatedPostPayload,
} from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const tags =query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray =Array.isArray(tags)?tags :[]

  const andConditions: PostWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: "Ron",
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: "Ron",
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({
      title: query.title,
    });
  }

  if(query.content){
    andConditions.push({
      content:query.content
    })
  }

  if(query.authorId){
    andConditions.push({
      authorId:query.authorId
    })
  }
  if(query.isFeatured){
    andConditions.push({
      isFeatured:Boolean(query.isFeatured)
    })
  }

  if(query.tags){
    andConditions.push({
      tags:{
      hasSome:tagsArray
      }
    })
  }

  const posts = await prisma.post.findMany({
    //* filtering / exact match with AND Operator
    // where: {
    //   AND: [
    //     { title: "My five Post" },
    //     { content: "Ronaldo" },
    //     {
    //       tags: {
    //          hasSome:["typescript"]
    //       },
    //     },
    //   ],
    // },

    //* Searching and partial match
    // where:{
    //   OR:[
    //     {
    //       title:{
    //         contains:"ron",
    //         mode:"insensitive"
    //       }
    //     },
    //     {
    //       content:{
    //         contains:"Ronaldo",
    //         mode:"insensitive"
    //       }
    //     }
    //   ]
    // },

    //* partial searching (OR) and exact Filtering (AND)
    // where: {
    //   AND: [
    //     {
    //       OR: [
    //         { title: { contains: "Ron", mode: "insensitive" } },
    //         {
    //           content: {
    //             contains: "ron",
    //             mode: "insensitive",
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       title: "Ronaldo Nazario",
    //     },
    //     {
    //       content: "Ronaldo",
    //     },
    //   ],
    // },

    // pagination
    // take:3,
    // skip:2,

    //sorting
    // orderBy:{
    //   createdAt:"desc"
    // },
    //* dynamic searching ,filtering ,sorting
    // where: {
    //   AND: [
    //     query.searchTerm
    //       ? {
    //           OR: [
    //             {
    //               title: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               content: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }
    //       : {},
    //     // title filtering
    //     query.title ? { title: query.title } : {},

    //     //content filtering

    //     query.content ? { content: query.content } : {},
    //   ],
    // },

    where: {
      AND: andConditions,
    },

    take: limit,
    skip: skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

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
const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPost =await tx.post.count()
    // const totalPublishedPosts =await tx.post.count({
    //   where:{
    //     status:PostStatus.PUBLISHED
    //   }
    // })
    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });
    // const totalArcivedPost = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });
    // const totalComments = await tx.comment.count();
    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });
    // const totalRejectComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECT,
    //   },
    // });

    // const TotalPostViewAggregate = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });

    // const totalPostViews =TotalPostViewAggregate._sum.views

    // return {
    //   totalPost,
    //   totalPublishedPosts,
    //   totalArcivedPost,
    //   totalDraftPosts,
    //   totalComments,
    //   totalApprovedComments,
    //   totalRejectComments,
    //   totalPostViews
    // }

    const [
      totalPost,
      totalPublishedPosts,
      totalDraftPosts,
      totalArcivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),
      await tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);
    return {
      totalPost,
      totalPublishedPosts,
      totalDraftPosts,
      totalArcivedPost,
      totalComments,
      totalRejectComments,
      totalApprovedComments,
      totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });
  return transactionResult;
};
const getMyPost = async (authorId: string) => {
  const myPosts = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return myPosts;
};
const getPostById = async (postId: string) => {
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  // return post;

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    // throw new Error("fake Error")
    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transactionResult;
};
const updatePost = async (
  postId: string,
  payload: IUpdatedPostPayload,
  authorId: string,
  isAdmin: boolean
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};
const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post!");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  createPost,
  getAllPost,
  getMyPost,
  getPostById,
  getPostsStats,
  updatePost,
  deletePost,
};
