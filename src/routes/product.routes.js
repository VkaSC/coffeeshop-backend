import { Router } from "express";
import ProductController from "./../controllers/product.controller";

const router = Router();

router.get("/product", ProductController.getProducts);
router.get("/product/:id", ProductController.getProduct);
router.post("/product", ProductController.addProduct);
router.put("/product/:id", ProductController.updateProduct);
router.delete("/product/:id", ProductController.deleteProduct);


export default router;