const router = require("express").Router();
const appointmentSlotsController = require("../controllers/appoinmentSlots");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/slotGroupList",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.STORE_TIME_MANAGEMENT]),
  appointmentSlotsController.slotGroupList
);

router.get(
  "/stylistByService/:merchantServiceId",
  auth.any,
  appointmentSlotsController.getStylistByService
);

router.get(
  "/appointmentStylistSlots/:stylistAccountId/:date",
  auth.merchantOrAdmin,
  appointmentSlotsController.getAppointmentStylistSlots
);

router.get(
  "/appointmentDates",
  auth.merchantOrAdmin,
  appointmentSlotsController.getAppointmentDates
);

router.post(
  "/appointment",
  auth.any,
  appointmentSlotsController.createAppointment
);

router.post(
  "/appointmentServiceTemporary",
  auth.any,
  appointmentSlotsController.createAppointmentServiceTemporary
);

router.get(
  "/merchantDashboardAppointments",
  auth.merchantOrAdmin,
  appointmentSlotsController.getMerchantDashboardAppointments
);

router.get(
  "/merchantAppointments/:appointmentId",
  auth.merchant,
  appointmentSlotsController.getOneMerchantAppointment
);

router.get(
  "/merchantAppointments",
  auth.merchantOrAdmin,
  appointmentSlotsController.getMerchantAppointments
);

router.get(
  "/merchantCanceledAppointments",
  auth.merchantOrAdmin,
  appointmentSlotsController.getMerchantCanceledAppointments
);

router.post(
  "/appointmentStatus",
  auth.merchantOrAdmin,
  appointmentSlotsController.updateAppointmentStatus
);

router.get(
  "/appointmentDates/:merchantStoreServiceId",
  auth.user,
  appointmentSlotsController.getAppointmentDates
);

router.get(
  "/appointmentStylistSlots/:merchantStoreServiceId/:stylistAccountId/:date",
  auth.user,
  appointmentSlotsController.getAppointmentStylistSlots
);

router.get(
  "/appointmentSlots/:merchantStoreServiceId/:date",
  auth.any,
  appointmentSlotsController.getAppointmentSlots
);

router.get(
  "/merchantOngoingAppointments",
  auth.merchantOrAdmin,
  appointmentSlotsController.getMerchantOngoingAppointments
);

module.exports = router;
