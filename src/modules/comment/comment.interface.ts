import { CommentStatus } from "../../../generated/prisma/enums";

export interface IcreatedCommentPayload{
          content:string,
          postId:string,
          status?:CommentStatus,
}