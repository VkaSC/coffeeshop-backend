import {Router} from "express";
import { methods as productAllergenRelController } from "../controllers/productAllergenRel.controller";

const router = Router();

router.get("/productAllergenRel/product/:id", productAllergenRelController.getProductByAllergen);
router.get("/productAllergenRel/allergen/:id", productAllergenRelController.getAllergenByProduct);
router.post("/productAllergenRel", productAllergenRelController.addProductAllergenRel);
router.delete("/productAllergenRel/:id", productAllergenRelController.deleteProductAllergenRel);


export default router;