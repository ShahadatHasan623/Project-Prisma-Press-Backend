import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";



const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await userService.registerUserIntoDB(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusbar: httpStatus.CREATED,
    message: "User created successfully",
    data: { user }
  });
});

export const userController = {
  registerUser,
};
