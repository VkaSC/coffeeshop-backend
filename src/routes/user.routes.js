import {Router} from "express";
import { methods as userController } from "../controllers/user.controller";

const router = Router();

router.get("/user", userController.getUser);
router.get("/user/:id", userController.getUser);
router.post("/user", userController.addUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);


export default router;