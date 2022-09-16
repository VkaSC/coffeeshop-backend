import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

router.get("/user", UserController.getUser);
router.get("/user/:id", UserController.getUser);
router.post("/user", UserController.addUser);
router.put("/user/:id", UserController.updateUser);
router.delete("/user/:id", UserController.deleteUser);


export default router;