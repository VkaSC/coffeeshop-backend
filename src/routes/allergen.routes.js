import { Router } from "express";
import AllergenController from "../controllers/allergen.controller";

const controller = new AllergenController();
const router = Router();

router.get("/allergen", controller.list);
router.get("/allergen/:id", controller.get);
router.post("/allergen", controller.create);
router.put("/allergen/:id", controller.update);
router.delete("/allergen/:id", controller.delete);


export default router;