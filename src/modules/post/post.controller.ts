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

    const query =req.query;
    const result =await postService.getAllPost(query)
    sendResponse(res,{
      success:true,
      statusCode:HttpStatus.OK,
      message:"Posts Retrieved Successfully",
      data:result
    })
  }
);
const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result =await postService.getPostsStats()
     sendResponse(res,{
      success:true,
      statusCode:HttpStatus.OK,
      message:"Stats Retrieved Successfully",
      data:result
    })
  }
);

const getPostByID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id =req.params.postId

    if(!id){
      throw new Error("Post Id Required In Params")
    }
    const result =await postService.getPostById(id as string)
    sendResponse(res,{
      success:true,
      statusCode:HttpStatus.OK,
      message:"Single Post Retrieved Successfully",
      data:result
    })
  }
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId =req.params.postId;
    const payload =req.body;
    const authorId =req.user?.id
    const isAdmin =req.user?.role === "ADMIN"

     if(!postId){
      throw new Error("Post Id Required In Params")
    }
    
    const result =await postService.updatePost(postId as string,payload,authorId as string,isAdmin)

     sendResponse(res,{
      success:true,
      statusCode:HttpStatus.OK,
      message:"Updated Post Retrieved Successfully",
      data:result
    })
  }
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId =req.params.postId;
    const authorId =req.user?.id;
    const isAdmin =req.user?.role === "ADMIN"

    if(!postId){
      throw new Error("Post Id Required In Params")
    }
    
    await postService.deletePost(postId as string,authorId as string,isAdmin)

    sendResponse(res,{
      success:true,
      statusCode:HttpStatus.OK,
      message:"Deleted Post Retrieved Successfully",
      data:null
    })
  }
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId =req.user?.id
    const result =await postService.getMyPost(authorId as string)

     sendResponse(res,{
      success:true,
      statusCode:HttpStatus.OK,
      message:"My Post Retrieved Successfully",
      data:result
    })
  }
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
