import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/SendResponse";
import  HttpStatus  from "http-status";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id =req.user?.id;
    const payload =req.body

    const result = await postService.createPost(payload,id as string)

    sendResponse(res,{
      success:true,
      statusCode:HttpStatus.CREATED,
      message:"Post created successfully",
      data:result
    })
  }
);

const getAllPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result =await postService.getAllPost()
    sendResponse(res,{
      success:true,
      statusCode:HttpStatus.OK,
      message:"Posts Retrieved Successfully",
      data:result
    })
  }
);
const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const getPostByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const postController = {
  createPost,
  getAllPost,
  getPostsStats,
  getMyPosts,
  getPostByID,
  updatePost,
  deletePost
};
