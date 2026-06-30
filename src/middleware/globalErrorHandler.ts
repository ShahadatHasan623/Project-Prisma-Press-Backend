import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error", err);

  let statusCode;
  let errorMessage = err.message || "Internal server Error";
  let errorName = err.name || "Internal server Error";
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;

    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      // Duplicate unique field
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Duplicate key Error";
    } else if (err.code === "P2003") {
      // Foreign key constraint
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      // Record not found
      statusCode = httpStatus.NOT_FOUND;

      errorMessage = "Record not found";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Authentication failed: Invalid database credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Database server is unreachable";
    } else if (err.errorCode === "P1002") {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Database connection timeout";
    } else if (err.errorCode === "P1003") {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = "Database does not exist";
    }
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode,
    message: errorMessage,
    name: errorName,
    error: err.stack,
  });
};
