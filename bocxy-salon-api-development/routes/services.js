const router = require("express").Router();
const servicesController = require("../controllers/services");
const auth = require("../controllers/authcheck");

router.get("/services", auth.any, servicesController.getAllServices);
router.get("/services/:serviceId", auth.admin, servicesController.getOne);
router.post("/services", auth.admin, servicesController.createOne);
router.put("/services/:serviceId", auth.admin, servicesController.updateOne);
router.delete("/services/:serviceId", auth.admin, servicesController.deleteOne);
router.get("/servicesList", servicesController.getServicesList);

module.exports = router;
