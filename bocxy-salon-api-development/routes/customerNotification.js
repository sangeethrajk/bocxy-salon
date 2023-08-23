const router = require("express").Router();
const customerNotificationController = require("../controllers/customerNotification");
const auth = require("../controllers/authcheck");

router.get(
  "/customerNotificationCount",
  auth.user,
  customerNotificationController.getCustomerNotificationCount
);

router.get(
  "/customerNotifications",
  auth.user,
  customerNotificationController.getCustomerNotifications
);

router.put(
  "/customerNotifications/:notificationId",
  auth.user,
  customerNotificationController.updateCustomerNotification
);

module.exports = router;
