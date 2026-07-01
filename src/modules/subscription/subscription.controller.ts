import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status"
const createSubscriptionSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionService.createSubscriptionSession(
      userId as string
    );
    sendResponse(res,{
          success:true,
          statusCode:httpStatus.OK,
          message:"payment checkout successfully",
          data:result
    })
  }
);

export const subscriptionController = {
  createSubscriptionSession,
};
