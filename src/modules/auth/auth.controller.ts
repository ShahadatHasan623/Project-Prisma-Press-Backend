import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SendResponse";
import { authService } from "./auth.service";
import httpStatus from "http-status";

const loginUser = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const loginedUser = await authService.loginUserIntoDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: loginedUser,
  });
});

export const authController = {
  loginUser,
};
