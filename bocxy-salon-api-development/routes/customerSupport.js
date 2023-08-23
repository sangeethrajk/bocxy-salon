const router = require("express").Router();
const customerSupportController = require("../controllers/customerSupport");
const auth = require("../controllers/authcheck");

router.post(
  "/sendCustomerSupport",
  auth.merchantOrUser,
  customerSupportController.sendCustomerSupporEmail
);

router.post("/webRegister", customerSupportController.sendRegisterEmail);
module.exports = router;
