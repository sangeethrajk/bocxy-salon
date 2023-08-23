const router = require("express").Router();
const accountsController = require("../controllers/accounts");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get("/accounts", auth.admin, accountsController.getAllRegister);
router.get("/checkAccountExist", accountsController.checkAccountExist);
router.get(
  "/checkProfessionistAccountExist",
  auth.permissionsAuth([constants.permissions.STYLIST_MANAGEMENT]),
  accountsController.checkProfessionistAccountExist
);
router.post("/accountPasswordUpdate", accountsController.accountPasswordUpdate);

router.post("/accountSlots", auth.merchant, accountsController.accountSlots);

router.get(
  "/currentAdminAccount",
  auth.admin,
  accountsController.getCurrentAdmin
);
router.get(
  "/currentUserAccount",
  auth.merchantOrUser,
  accountsController.getCurrentUser
);

router.post("/profileUpdate", auth.any, accountsController.profileUpdate);
router.get(
  "/currentUserAccountDetails",
  auth.merchantOrUser,
  accountsController.currentUserAccountDetails
);
router.post(
  "/profilePasswordUpdate",
  auth.any,
  accountsController.profilePasswordUpdate
);
router.post("/profileVerifyOtp", auth.any, accountsController.profileVerifyOtp);
router.post("/profileOtp", auth.any, accountsController.profileOtp);

module.exports = router;
