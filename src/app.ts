import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { postRouter } from "./modules/post/post.route";
import { commentRouter } from "./modules/comment/comment.route";
import { NotFound } from "./middleware/NotFound";
import httpStatus from "http-status"
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

// app.post("/api/users/register", );
app.use("/api/users", userRoutes);
app.use("/api/auth/", authRoute);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

// app.use((req: Request, res: Response) => {
//   res.status(404).json({
//     message: "Route Not Found",
//     path: req.originalUrl,
//     date: Date(),
//   });
// });

app.use(NotFound)

// app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
//   res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         statuCode: httpStatus.INTERNAL_SERVER_ERROR,
//         message:err.message,
//         name:err.name,
//         error:err.stack
//       });
// })

app.use(globalErrorHandler)

export default app;
