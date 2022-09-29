import { Router } from "express";
import UserMiddlewares from "../middlewares/user.middleware";
import ProductController from "./../controllers/product.controller";

const userMiddleware = new UserMiddlewares();
const controller = new ProductController();
const router = Router();

router.get("/product", [userMiddleware.userData.bind(userMiddleware)], controller.list.bind(controller));
router.get("/product/:id", [userMiddleware.userData.bind(userMiddleware)], controller.get.bind(controller));
router.post("/product", [userMiddleware.authUser.bind(userMiddleware)], controller.create.bind(controller));
router.put("/product/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.update.bind(controller));
router.delete("/product/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.delete.bind(controller));


export default router;