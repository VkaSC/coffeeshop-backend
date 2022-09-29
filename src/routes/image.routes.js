import {Router} from "express";
import ImageController from "../controllers/image.controller";

const controller = new ImageController();
const router = Router();

router.get("/:image", controller.get.bind(controller));


export default router;