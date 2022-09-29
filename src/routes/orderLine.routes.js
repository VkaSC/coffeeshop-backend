import { Router } from "express";
import OrderLineController from "../controllers/orderLine.controller";
import UserMiddlewares from "../middlewares/user.middleware";

const userMiddleware = new UserMiddlewares();
const controller = new OrderLineController();
const router = Router();

router.get("/order/:order/line", [userMiddleware.userData.bind(userMiddleware)], controller.list.bind(controller));
router.get("/order/:order/line/:id", [userMiddleware.userData.bind(userMiddleware)], controller.get.bind(controller));
router.post("/order/:order/line", [userMiddleware.userData.bind(userMiddleware)], controller.create.bind(controller));
router.delete("/order/:order/line/:id", [userMiddleware.userData.bind(userMiddleware)], controller.delete.bind(controller));


export default router;