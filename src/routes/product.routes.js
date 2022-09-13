import {Router} from "express";
import { methods as productController } from "./../controllers/product.controller";

const router = Router();

router.get("/product", productController.getProducts);
router.get("/product/:id", productController.getProduct);
router.post("/product", productController.addProduct);
router.put("/product/:id", productController.updateProduct);
router.delete("/product/:id", productController.deleteProduct);


export default router;