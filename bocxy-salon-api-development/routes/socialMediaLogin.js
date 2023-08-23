const router = require("express").Router();
const loginController = require("../controllers/socialMediaLogin");

router.post("/socialMediaLogin", loginController.login);
router.post("/socialMediaRegister", loginController.register);


module.exports = router;
