const router = require("express").Router();
const permissionsController = require("../controllers/permissions");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/permissions",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_MANAGEMENT]),
  permissionsController.getPermissions
);

module.exports = router;
