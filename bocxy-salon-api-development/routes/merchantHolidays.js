const router = require("express").Router();
const merchantHolidaysController = require("../controllers/merchantHolidays.js");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/merchantHolidays",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.HOLIDAY_MANAGEMENT]),
  merchantHolidaysController.getMerchantHolidays
);

router.get(
  "/merchantHolidays/:id",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.HOLIDAY_MANAGEMENT]),
  merchantHolidaysController.getOne
);

router.post(
  "/merchantHolidays",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.HOLIDAY_MANAGEMENT]),
  merchantHolidaysController.createMerchantHolidays
);

router.put(
  "/merchantHolidays/:id",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.HOLIDAY_MANAGEMENT]),
  merchantHolidaysController.updateMerchantHolidays
);

router.delete(
  "/merchantHolidays/:id",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.HOLIDAY_MANAGEMENT]),
  merchantHolidaysController.deleteMerchantHoliday
);

module.exports = router;
