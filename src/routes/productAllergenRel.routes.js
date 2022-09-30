const { Router } = require("express");
const ProductAllergenController = require("../controllers/productAllergen.controller");
const UserMiddlewares = require("../middlewares/user.middleware");

const userMiddleware = new UserMiddlewares();
const controller = new ProductAllergenController();
const router = Router();

router.get("/productAllergen/product/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.list.bind(controller));
router.get("/productAllergen/allergen/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.get.bind(controller));
router.post("/productAllergen", [userMiddleware.authUser.bind(userMiddleware)], controller.create.bind(controller));
router.delete("/productAllergen/:id", [userMiddleware.authUser.bind(userMiddleware)], controller.delete.bind(controller));


module.exports = router;