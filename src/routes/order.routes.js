const { Router } = require("express");
const UserMiddlewares = require("../middlewares/user.middleware");
const OrderController = require("../controllers/order.controller");

const userMiddleware = new UserMiddlewares();
const controller = new OrderController();
const router = Router();

router.get("/order", [userMiddleware.userData.bind(userMiddleware)], controller.list.bind(controller));
router.get("/order/:id", [userMiddleware.userData.bind(userMiddleware)], controller.get.bind(controller));
router.post("/order", [userMiddleware.userData.bind(userMiddleware)], controller.create.bind(controller));
router.put("/order/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.update.bind(controller));
router.delete("/order/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.delete.bind(controller));


module.exports = router;