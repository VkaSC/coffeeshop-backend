import { Router } from "express";
import AllergenController from "../controllers/allergen.controller";
import UserMiddlewares from "../middlewares/user.middleware";

const controller = new AllergenController();
const router = Router();

router.get("/allergen", controller.list.bind(controller));
router.get("/allergen/:id", controller.get.bind(controller));
router.post("/allergen", [UserMiddlewares.authUser], controller.create.bind(controller));
router.put("/allergen/:id", [UserMiddlewares.authUser], controller.update.bind(controller));
router.delete("/allergen/:id", [UserMiddlewares.authUser], controller.delete.bind(controller));


export default router;