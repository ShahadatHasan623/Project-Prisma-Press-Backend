import { CommentStatus } from "../../../generated/prisma/enums";

export interface IcreatedCommentPayload {
  content: string;
  postId: string;
  authorId?:string
}

export interface IUpdatedCommentPayload {
  content?: string;
  status?: CommentStatus;
}

export interface ICreatedModeratorPayload {
  status: CommentStatus;
}
