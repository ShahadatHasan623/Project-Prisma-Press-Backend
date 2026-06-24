import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import User from "./user.interface";

const registerUserIntoDB = async (payload: User) => {
  const { name, email, password, profilePhoto } = payload;

  const isUsersExist = await prisma.user.findUnique({ where: { email } });
  if (isUsersExist) {
    throw new Error("User already exists with this email");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds)
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile: {
        create: {
          profilePhoto
        },
      },
    },
  });

  // await prisma.profile.create({
  //   data: {
  //     userId: createdUser.id,
  //     profilePhoto,
  //   },
  // });
  const user = await prisma.user.findUnique({
    where: { id: createdUser.id, email: createdUser.email || email },
    omit: { password: true },
    include: { profile: true },
  });
  return user;
};

const getMyProfileFromDB = async (userId: string) => {
  
  const user =await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { profile: true },
    omit: { password: true },
  });
  return user;
  
};
export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
};
