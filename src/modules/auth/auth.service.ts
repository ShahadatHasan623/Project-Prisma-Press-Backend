import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import bcrypt from "bcrypt";



const loginUserIntoDB =async(payload:ILoginUser)=>{
     const {email,password}=payload;

     const user =await prisma.user.findUniqueOrThrow({
          where:{email}
     })

     const passwordMatch =await bcrypt.compare(password,user.password)

     if(!passwordMatch){
          throw new Error("Invalid credentials")
     }

     return user;
}

export const authService ={
          loginUserIntoDB
}