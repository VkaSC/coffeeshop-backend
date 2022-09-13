import {Router} from "express";
import { methods as orderController } from "../controllers/order.controller";

const router = Router();

router.get("/order", orderController.getOrders);
router.get("/order/:id", orderController.getOrder);
router.post("/order", orderController.addOrder);
router.put("/order/:id", orderController.updateOrder);
router.delete("/order/:id", orderController.deleteOrder);


export default router;