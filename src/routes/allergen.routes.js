import {Router} from "express";
import AllergenController from "../controllers/allergen.controller";

const router = Router();

router.get("/allergen", AllergenController.getAllergens);
router.get("/allergen/:id", AllergenController.getAllergen);
router.post("/allergen", AllergenController.addAllergen);
router.put("/allergen/:id", AllergenController.updateAllergen);
router.delete("/allergen/:id", AllergenController.deleteAllergen);


export default router;