import { Router } from "express";
import OrderController from "../controllers/order.controller";

const controller = new OrderController();
const router = Router();

router.get("/order", controller.list.bind(controller));
router.get("/order/:id", controller.get.bind(controller));
router.post("/order", controller.create.bind(controller));
router.put("/order/:id", controller.update.bind(controller));
router.delete("/order/:id", controller.delete.bind(controller));


export default router;