import {Router} from "express";
import ProductAllergenController from "../controllers/productAllergen.controller";


const controller = new ProductAllergenController();
const router = Router();

router.get("/productAllergen/product/:id", controller.list.bind(controller));
router.get("/productAllergen/allergen/:id", controller.get.bind(controller));
router.post("/productAllergen", controller.create.bind(controller));
router.delete("/productAllergen/:id", controller.delete.bind(controller));


export default router;