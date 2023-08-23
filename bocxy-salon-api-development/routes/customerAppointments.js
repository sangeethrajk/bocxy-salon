const router = require("express").Router();
const customerAppointments = require("../controllers/customerAppointments");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/customerAppointments",
  auth.user,
  customerAppointments.getCustomerAppointments
);

router.get(
  "/customerAppointments/:appointmentId",
  auth.user,
  customerAppointments.getOneCustomerAppointment
);

module.exports = router;
