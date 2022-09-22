import {Router} from "express";
import ProductAllergenController from "../controllers/productAllergen.controller";
import UserMiddlewares from "../middlewares/user.middleware";


const controller = new ProductAllergenController();
const router = Router();

router.get("/productAllergen/product/:id", [UserMiddlewares.authUser], controller.list.bind(controller));
router.get("/productAllergen/allergen/:id", [UserMiddlewares.authUser], controller.get.bind(controller));
router.post("/productAllergen", [UserMiddlewares.authUser], controller.create.bind(controller));
router.delete("/productAllergen/:id", [UserMiddlewares.authUser], controller.delete.bind(controller));


export default router;