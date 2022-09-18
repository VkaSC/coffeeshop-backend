import {Router} from "express";
import ProductAllergenController from "../controllers/productAllergen.controller";


const controller = new ProductAllergenController();
const router = Router();

router.get("/productAllergen/product/:id", controller.list);
router.get("/productAllergen/allergen/:id", controller.get);
router.post("/productAllergen", controller.create);
router.delete("/productAllergen/:id", controller.delete);


export default router;