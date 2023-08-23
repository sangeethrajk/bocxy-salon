const router = require("express").Router();
const registerController = require("../controllers/register");

router.post("/register", registerController.register);
router.post("/verifyOtp", registerController.verifyOtp);
router.post("/registerProfile", registerController.registerProfile);
router.post("/resendOtp", registerController.resendOtp);

module.exports = router;