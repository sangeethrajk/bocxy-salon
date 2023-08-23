const router = require("express").Router();
const loginController = require("../controllers/login");
const auth = require("../controllers/authcheck");

router.post("/login", loginController.login);

router.post("/forgotPassword", loginController.forgotPassword);
router.get(
  "/getAccountSecurityQuestions",
  loginController.getAccountSecurityQuestions
);
router.post(
  "/checkAccountSecurityQuestion",
  loginController.checkAccountSecurityQuestion
);
router.get("/getSecurityQuestions", loginController.getSecurityQuestions);

router.get("/appVersionCheck/:type", loginController.getAppVersion);

module.exports = router;
