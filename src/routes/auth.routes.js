import {Router} from "express";
import { methods as authController } from "../controllers/auth.controller";

const router = Router();


router.post("/register", authController.singUp);

export default router;
