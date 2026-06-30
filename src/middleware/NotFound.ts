import { Request, Response } from "express";

export const NotFound=((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route Not Found",
    path: req.originalUrl,
    date: Date(),
  });
})