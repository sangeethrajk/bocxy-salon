const router = require("express").Router();
const merchantSpecialSlotsController = require("../controllers/merchantSpecialSlots.js");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/merchantSpecialSlots/:merchantSpecialSlotId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([
    constants.permissions.STORE_TIME_MANAGEMENT,
    constants.permissions.STYLIST_SLOT_CONFIGURATION,
  ]),
  merchantSpecialSlotsController.getMerchantSpecialSlot
);

router.get(
  "/merchantSpecialSlots",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSpecialSlotsController.getMerchantSpecialSlots
);

router.get(
  "/merchantSpecialSlotList",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_SLOT_CONFIGURATION]),
  merchantSpecialSlotsController.getMerchantSpecialSlotsList
);

router.post(
  "/merchantSpecialSlots",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSpecialSlotsController.createMerchantSpecialSlots
);

router.put(
  "/merchantSpecialSlots/:id",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSpecialSlotsController.updateMerchantSpecialSlot
);

router.delete(
  "/merchantSpecialSlots/:id",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSpecialSlotsController.deleteMerchantSpecialSlot
);

router.get(
  "/checkSpecialSlotsByDate",
  auth.merchantOrAdmin,
  merchantSpecialSlotsController.checkSpecialSlotsByDate
);

module.exports = router;
