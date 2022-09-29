import { Router } from "express";
import AllergenController from "../controllers/allergen.controller";
import UserMiddlewares from "../middlewares/user.middleware";
import Writer from "../utils/fileSystem/writer";
const multiparty = require('connect-multiparty');
const midlewareUpload = multiparty({ uploadDir: 'src/uploads/images' });

const userMiddleware = new UserMiddlewares();
const controller = new AllergenController();
const router = Router();

Writer.createFolderSync('./src/uploads/images');

router.get("/allergen", [userMiddleware.userData.bind(userMiddleware)], controller.list.bind(controller));
router.get("/allergen/:id", [userMiddleware.userData.bind(userMiddleware)], controller.get.bind(controller));
router.post("/allergen", [userMiddleware.authUser.bind(userMiddleware)], controller.create.bind(controller));
router.put("/allergen/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.update.bind(controller));
router.post("/allergen/:id/icon/upload", [userMiddleware.authUser.bind(userMiddleware), midlewareUpload], controller.upload.bind(controller));
router.delete("/allergen/:id/icon/delete", [userMiddleware.authUser.bind(userMiddleware)], controller.deleteIcon.bind(controller));
router.delete("/allergen/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.delete.bind(controller));


export default router;