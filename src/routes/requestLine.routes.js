import { Router } from "express";
import RequestLineController from "../controllers/requestLine.controller";

const controller = new RequestLineController();
const router = Router();

router.get("/order/:order/line", controller.list.bind(controller));
router.get("/order/:order/line/:id", controller.get.bind(controller));
router.post("/order/:order/line", controller.create.bind(controller));
router.delete("/order/:order/line/:id", controller.delete.bind(controller));


export default router;