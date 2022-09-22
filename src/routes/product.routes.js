import { Router } from "express";
import UserMiddlewares from "../middlewares/user.middleware";
import ProductController from "./../controllers/product.controller";


const controller = new ProductController();
const router = Router();

router.get("/product", controller.list.bind(controller));
router.get("/product/:id", controller.get.bind(controller));
router.post("/product", [UserMiddlewares.authUser], controller.create.bind(controller));
router.put("/product/:id", [UserMiddlewares.authUser], controller.update.bind(controller));
router.delete("/product/:id", [UserMiddlewares.authUser], controller.delete.bind(controller));


export default router;