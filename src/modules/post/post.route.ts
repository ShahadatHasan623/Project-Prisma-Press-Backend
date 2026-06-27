import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router =Router();

router.post('/',auth(Role.ADMIN,Role.USER,Role.AUTHOR),postController.createPost)
router.get('/',postController.getAllPost)
router.get('/stats',auth(Role.ADMIN),postController.getPostsStats)
router.get('/my-posts',auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.getMyPosts)
router.get('/:postId',postController.getPostByID)
router.patch('/:postId',auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.updatePost)
router.delete('/:postId',auth(Role.ADMIN,Role.USER,Role.AUTHOR),postController.updatePost)



export const postRouter =router