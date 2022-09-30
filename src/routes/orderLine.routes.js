const { Router } = require("express");
const UserMiddlewares = require("../middlewares/user.middleware");
const OrderLineController = require("../controllers/orderLine.controller");

const userMiddleware = new UserMiddlewares();
const controller = new OrderLineController();
const router = Router();

router.get("/order/:order/line", [userMiddleware.userData.bind(userMiddleware)], controller.list.bind(controller));
router.get("/order/:order/line/:id", [userMiddleware.userData.bind(userMiddleware)], controller.get.bind(controller));
router.post("/order/:order/line", [userMiddleware.userData.bind(userMiddleware)], controller.create.bind(controller));
router.delete("/order/:order/line/:id", [userMiddleware.userData.bind(userMiddleware)], controller.delete.bind(controller));


module.exports = router;