import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

const loginUserIntoDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }
  const jwtPayload = {
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role,
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions
  );

  return { accessToken, refreshToken, user };
};

export const authService = {
  loginUserIntoDB,
};
