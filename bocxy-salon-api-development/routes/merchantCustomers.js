const router = require("express").Router();
const merchantCustomers = require("../controllers/merchantCustomers");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/merchantCustomerVisited",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.CUSTOMER_MANAGEMENT]),
  merchantCustomers.visited
);
router.get(
  "/merchantCustomerRegular",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.CUSTOMER_MANAGEMENT]),
  merchantCustomers.regular
);
// router.post("/registerProfile", merchantCustomers.registerProfile);
// router.post("/resendOtp", merchantCustomers.resendOtp);

module.exports = router;
