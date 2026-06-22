import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  const payload = req.body;

  try {
    const user = await userService.registerUserIntoDB(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusbar: httpStatus.CREATED,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusbar: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create user",
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const userController = {
  registerUser,
};
