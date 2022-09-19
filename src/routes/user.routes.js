import { Router } from "express";
import UserController from "../controllers/user.controller";


const controller = new UserController();
const router = Router();

router.get("/user", controller.list.bind(controller));
router.get("/user/:id", controller.get.bind(controller));
router.post("/user", controller.create.bind(controller));
router.put("/user/:id", controller.update.bind(controller));
router.delete("/user/:id", controller.delete.bind(controller));


export default router;