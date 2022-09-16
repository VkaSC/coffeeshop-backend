import {Router} from "express";
import ProductAllergenRelController from "../controllers/productAllergenRel.controller";

const router = Router();

router.get("/productAllergenRel/product/:id", ProductAllergenRelController.getProductByAllergen);
router.get("/productAllergenRel/allergen/:id", ProductAllergenRelController.getAllergenByProduct);
router.post("/productAllergenRel", ProductAllergenRelController.addProductAllergenRel);
router.delete("/productAllergenRel/:id", ProductAllergenRelController.deleteProductAllergenRel);


export default router;