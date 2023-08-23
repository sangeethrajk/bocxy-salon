const router = require("express").Router();
const professionistController = require("../controllers/professionist");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/professionist",
  auth.merchantOrAdmin,
  auth.permissionsAuth([
    constants.permissions.STYLIST_MANAGEMENT,
    constants.permissions.STYLIST_SLOT_CONFIGURATION,
  ]),
  professionistController.getAllProfessionist
);
router.get(
  "/professionist/:professionistId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_MANAGEMENT]),
  professionistController.getOne
);
router.post(
  "/professionist",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_MANAGEMENT]),
  professionistController.createOne
);
router.put(
  "/professionist/:professionistId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_MANAGEMENT]),
  professionistController.updateOne
);
router.delete(
  "/professionist/:professionistId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_MANAGEMENT]),
  professionistController.deleteOne
);
router.get(
  "/professionistProfileComplete",
  professionistController.getProfessionistProfileComplete
);

router.post(
  "/professionistSlots",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_SLOT_CONFIGURATION]),
  professionistController.professionistSlots
);

router.get(
  "/professionistSlots/:professionistAccountId/:slotType/:slotId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_SLOT_CONFIGURATION]),
  professionistController.getMerchantProfessionistSlots
);

router.get(
  "/professionList",
  auth.merchantOrAdmin,
  professionistController.getAllProfessions
);

router.get(
  "/stylistList",
  auth.merchantOrAdmin,
  professionistController.getStylistList
);

router.put(
  "/professionistPermissions/:professionistId",
  auth.merchantOrAdmin,
  professionistController.updateProfessionistPermissions
);

router.get(
  "/professionistPermissions/:professionistId",
  auth.merchantOrAdmin,
  professionistController.getProfessionistPermissions
);

module.exports = router;
