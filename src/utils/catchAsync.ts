import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      //   success: false,
      //   statusbar: httpStatus.INTERNAL_SERVER_ERROR,
      //   message: "Failed to create user",
      //   data: null,
      //   error:
      //     error instanceof Error ? error.message : "An unknown error occurred",
      // });
      next(error)
    }
  };
};