import { NextFunction, Request, Response, Router } from "express";

import config from "../../config";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

const auth = (...requiredRoles:Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new Error(
        "You are not logged in.Please log in to access this resource."
      );
    }

    const verfiedUser = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verfiedUser.success) {
      throw new Error(verfiedUser.error);
    }
    const { email, name, id, role } = verfiedUser.data as JwtPayload;

    if(requiredRoles.length && !requiredRoles.includes(role)){
      throw new Error("Forbidden. You don't have permission to access this resource")
    }
    const user =await prisma.user.findUnique({
      where:{
        id,
        email,
        name,
        role
      }
    })

    if(!user){
      throw new Error("User not found.Please log in again.")
    }
    if(user.activeStatus === "BLOCKED"){
      throw new Error("Your account has been blocked.Please contact support")
    }
    req.user={
      email,
      name,
      id,
      role
    }
    next()
  });
};

router.post("/register", userController.registerUser);
router.get("/me",auth(Role.ADMIN,Role.AUTHOR,Role.USER),userController.getMyProfile);
export const userRoutes = router;
