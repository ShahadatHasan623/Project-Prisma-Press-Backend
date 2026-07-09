import { NextFunction, Request, Response, Router } from "express";
import { premiumController } from "./premium.controller";
import { auth } from "../middleware/auth";
import { Role, subscriptionStatus } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import { subscriptionGuard } from "../middleware/premiumGuard";

const router = Router();

router.get(
  "/",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  subscriptionGuard(),
  premiumController.getPremiumContent
);

export const premiumRoutes = router;
