import { Router } from "express";
import AllergenController from "../controllers/allergen.controller";

const controller = new AllergenController();
const router = Router();

router.get("/allergen", controller.list.bind(controller));
router.get("/allergen/:id", controller.get.bind(controller));
router.post("/allergen", controller.create.bind(controller));
router.put("/allergen/:id", controller.update.bind(controller));
router.delete("/allergen/:id", controller.delete.bind(controller));


export default router;