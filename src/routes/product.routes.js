import { Router } from "express";
import ProductController from "./../controllers/product.controller";


const controller = new ProductController();
const router = Router();

router.get("/product", controller.list);
router.get("/product/:id", controller.get);
router.post("/product", controller.create);
router.put("/product/:id", controller.update);
router.delete("/product/:id", controller.delete);


export default router;