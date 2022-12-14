const { Router } = require("express");
const ImageController = require("../controllers/image.controller");

const controller = new ImageController();
const router = Router();

router.get("/images/:image", controller.get.bind(controller));


module.exports = router;