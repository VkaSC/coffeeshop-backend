import { Router } from "express";
import RequestLineController from "../controllers/requestLine.controller";

const router = Router();

router.get("/order/:order/line/product/:id", RequestLineController.getRequestLinesByProduct);
router.get("/order/:order/line/request/:id", RequestLineController.getRequestLinesByRequest);
router.get("/order/:order/", RequestLineController.getRequestLines);
router.get("/order/:order/line/:id", RequestLineController.getRequestLine);
router.post("/order/:order/line", RequestLineController.addRequestLine);
router.delete("/order/:order/line/:id", RequestLineController.deleteRequestLine);


export default router;