const router = require("express").Router();
const merchantNotificationController = require("../controllers/merchantNotification");
const auth = require("../controllers/authcheck");

router.get(
  "/merchantNotificationCount",
  auth.merchant,
  merchantNotificationController.getMerchantNotificationCount
);

router.get(
  "/merchantNotifications",
  auth.merchant,
  merchantNotificationController.getMerchantNotifications
);

router.put(
  "/merchantNotifications/:notificationId",
  auth.merchant,
  merchantNotificationController.updateMerchantNotification
);

module.exports = router;
