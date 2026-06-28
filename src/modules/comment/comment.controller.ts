import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commnetService } from "./comment.service";
import { sendResponse } from "../../utils/SendResponse";
import HttpStatus  from "http-status";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId =req.user?.id;
    const payload =req.body;
    const result =await commnetService.createComment(authorId as string,payload)
    sendResponse(res,{
      success:true,
      statusCode:HttpStatus.CREATED,
      message:"comment created successfully!",
      data:result
    })
  }
);
const getCommentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id =req.params.commentId
    const result =await commnetService.getCommentById(id as string)

    sendResponse(res,{
      success:true,
      statusCode:HttpStatus.OK,
      message:"comment by id Retrived successfully!",
      data:result
    })
  }
);
const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const commentsController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  updateComment,
  deleteComment,
  moderateComment
};
