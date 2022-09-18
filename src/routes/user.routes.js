import { Router } from "express";
import UserController from "../controllers/user.controller";


const controller = new UserController();
const router = Router();

router.get("/user", controller.list);
router.get("/user/:id", controller.get);
router.post("/user", controller.create);
router.put("/user/:id", controller.update);
router.delete("/user/:id", controller.delete);


export default router;