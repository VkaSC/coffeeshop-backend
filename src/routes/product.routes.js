import { Router } from "express";
import ProductController from "./../controllers/product.controller";


const controller = new ProductController();
const router = Router();

router.get("/product", controller.list.bind(controller));
router.get("/product/:id", controller.get.bind(controller));
router.post("/product", controller.create.bind(controller));
router.put("/product/:id", controller.update.bind(controller));
router.delete("/product/:id", controller.delete.bind(controller));


export default router;