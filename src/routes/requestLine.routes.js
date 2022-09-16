import { Router } from "express";
import RequestLineController from "../controllers/requestLine.controller";

const router = Router();

router.get("/requestLine/product/:id", RequestLineController.getRequestLinesByProduct);
router.get("/requestLine/request/:id", RequestLineController.getRequestLinesByRequest);
router.get("/requestLine", RequestLineController.getRequestLines);
router.get("/requestLine/:id", RequestLineController.getRequestLine);
router.post("/requestLine", RequestLineController.addRequestLine);
router.delete("/requestLine/:id", RequestLineController.deleteRequestLine);


export default router;