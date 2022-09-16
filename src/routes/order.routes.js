import { Router } from "express";
import OrderController from "../controllers/order.controller";

const router = Router();

router.get("/order", OrderController.getOrders);
router.get("/order/:id", OrderController.getOrder);
router.post("/order", OrderController.addOrder);
router.put("/order/:id", OrderController.updateOrder);
router.delete("/order/:id", OrderController.deleteOrder);


export default router;