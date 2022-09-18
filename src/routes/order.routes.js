import { Router } from "express";
import OrderController from "../controllers/order.controller";

const controller = new OrderController();
const router = Router();

router.get("/order", controller.list);
router.get("/order/:id", controller.get);
router.post("/order", controller.create);
router.put("/order/:id", controller.update);
router.delete("/order/:id", controller.delete);


export default router;