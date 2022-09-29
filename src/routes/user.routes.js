import { Router } from "express";
import UserController from "../controllers/user.controller";
import UserMiddlewares from "../middlewares/user.middleware";

const userMiddleware = new UserMiddlewares();
const controller = new UserController();
const router = Router();

router.get("/user", [userMiddleware.authUser.bind(userMiddleware)], controller.list.bind(controller));
router.get("/user/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.get.bind(controller));
router.post("/user", [userMiddleware.authUser.bind(userMiddleware)], controller.create.bind(controller));
router.put("/user/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.update.bind(controller));
router.delete("/user/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.delete.bind(controller));


export default router;