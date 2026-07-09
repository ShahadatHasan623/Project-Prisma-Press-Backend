import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";
import { IPostQuery } from "../modules/post/post.interface";

const getPremiumContent = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
  
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  
    const tags = query.tags ? JSON.parse(query.tags as string) : null;
    const tagsArray = Array.isArray(tags) ? tags : [];
  
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
  
    if (query.content) {
      andConditions.push({
        content: query.content,
      });
    }
  
    if (query.authorId) {
      andConditions.push({
        authorId: query.authorId,
      });
    }
    if (query.isFeatured) {
      andConditions.push({
        isFeatured: Boolean(query.isFeatured),
      });
    }
  
    if (query.tags) {
      andConditions.push({
        tags: {
          hasSome: tagsArray,
        },
      });
    }
  
    andConditions.push({
      isPremium: true
    });
  const result = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },
  });
  const totalPosts = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: result,
    meta: {
      total: totalPosts,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalPosts / limit),
    },
  };
};

export const premiumService = {
  getPremiumContent,
};
