import {Router} from "express";
import { methods as requestLineController } from "../controllers/requestLine.controller";

const router = Router();

router.get("/requestLine/product/:id", requestLineController.getProductByOrder);
router.get("/requestLine/allergen/:id", requestLineController.getOrderByProduct);
router.post("/requestLine", requestLineController.addRequestLine);
router.delete("/requestLine/:id", requestLineController.deleteRequestLine);


export default router;