import {Router} from "express";
import { methods as allergenController } from "../controllers/allergen.controller";

const router = Router();

router.get("/allergen", allergenController.getAllergens);
router.get("/allergen/:id", allergenController.getAllergen);
router.post("/allergen", allergenController.addAllergen);
router.put("/allergen/:id", allergenController.updateAllergen);
router.delete("/allergen/:id", allergenController.deleteAllergen);


export default router;