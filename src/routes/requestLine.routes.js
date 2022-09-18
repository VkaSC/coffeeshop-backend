import { Router } from "express";
import RequestLineController from "../controllers/requestLine.controller";

const controller = new RequestLineController();
const router = Router();

router.get("/order/:order/line", controller.list);
router.get("/order/:order/line/:id", controller.get);
router.post("/order/:order/line", controller.create);
router.delete("/order/:order/line/:id", controller.delete);


export default router;