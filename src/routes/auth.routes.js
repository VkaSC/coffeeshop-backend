const { Router } = require("express");
const AuthController = require("../controllers/auth.controller");

const controller = new AuthController();
const router = Router();

router.post("/auth/login", controller.login.bind(controller));
router.post("/auth/logout", controller.logout.bind(controller));
router.post("/auth/refresh", controller.refresh.bind(controller));
router.post("/auth/activation/email", controller.activationEmail.bind(controller));
router.put("/auth/activate/:token", controller.activate.bind(controller));
router.post("/auth/recovering/email", controller.recoveryEmail.bind(controller));
router.put("/auth/recovery/:token", controller.recovery.bind(controller));
router.delete("/auth/revoking/:token", controller.recovery.bind(controller));

module.exports = router;
