const router = require("express").Router();
const merchantSlotsController = require("../controllers/merchantSlots.js");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/merchantSlots/:merchantSlotId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSlotsController.getMerchantSlot
);

router.get(
  "/merchantSlots",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSlotsController.getMerchantSlots
);

router.post(
  "/merchantSlots",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSlotsController.createMerchantSlots
);

router.get(
  "/merchantSlotList",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_SLOT_CONFIGURATION]),
  merchantSlotsController.merchantSlotList
);

router.get(
  "/merchantSlotDetails/:merchantSlotId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STYLIST_SLOT_CONFIGURATION]),
  merchantSlotsController.getOnemerchantSlots
);

router.get(
  "/checkSlotsStartDate",
  auth.merchantOrAdmin,
  merchantSlotsController.checkSlotsStartDate
);

router.post(
  "/storeDefaultSlot",
  auth.merchant,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSlotsController.createStoreDefaultSlots
);

router.get(
  "/storeDefaultSlot",
  auth.merchant,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  merchantSlotsController.getStoreDefaultSlots
);
router.get("/checkSlotExist", merchantSlotsController.checkSlotExist);
router.get("/checkSplSlotExist", merchantSlotsController.checkSplSlotExist);

module.exports = router;
