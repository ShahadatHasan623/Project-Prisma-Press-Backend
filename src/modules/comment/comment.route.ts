import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentsController } from "./comment.controller";

const router = Router();

router.post('/',auth(Role.ADMIN,Role.USER,Role.AUTHOR),commentsController.createComment)
router.get("/:postId",commentsController.getCommentById)
router.get("/author/:authorId",commentsController.getCommentByAuthorId)
router.patch('/:commentId',auth(Role.ADMIN,Role.AUTHOR,Role.USER),commentsController.updateComment)
router.delete('/:commentId',auth(Role.ADMIN,Role.USER,Role.AUTHOR),commentsController.deleteComment)
router.put('/:commentId/moderate',auth(Role.ADMIN),commentsController.moderateComment)


export const commentRouter = router;
