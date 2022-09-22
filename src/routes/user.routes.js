import { Router } from "express";
import UserController from "../controllers/user.controller";
import UserMiddlewares from "../middlewares/user.middleware";


const controller = new UserController();
const router = Router();

router.get("/user", [UserMiddlewares.authUser], controller.list.bind(controller));
router.get("/user/:id", [UserMiddlewares.authUser], controller.get.bind(controller));
router.post("/user", [UserMiddlewares.authUser], controller.create.bind(controller));
router.put("/user/:id", [UserMiddlewares.authUser], controller.update.bind(controller));
router.delete("/user/:id", [UserMiddlewares.authUser], controller.delete.bind(controller));


export default router;