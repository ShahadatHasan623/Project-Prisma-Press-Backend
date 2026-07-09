import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/SendResponse";
import httpStatus from "http-status";
const createSubscriptionSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await subscriptionService.createSubscriptionSession(
      userId as string
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "payment checkout successfully",
      data: result,
    });
  }
);
const handleWebhook = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  console.log("Webhook Hit");
  console.log("Body Buffer:", Buffer.isBuffer(req.body));
  console.log("Signature:", req.headers["stripe-signature"]);

  const payload = req.body as Buffer;
  const signature = req.headers["stripe-signature"] as string;

  await subscriptionService.handleWebhook(payload, signature);

  res.status(200).json({
    success: true,
  });
});

const getSubscriptionStatus =catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const userId =req.user?.id;
  const result =await subscriptionService.getSubscriptionStatus(userId as string);

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Subscription status retrived successfully",
    data:result
  })
})
export const subscriptionController = {
  createSubscriptionSession,
  handleWebhook,
  getSubscriptionStatus
};
