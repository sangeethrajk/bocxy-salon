const router = require("express").Router();
const merchantServicesController = require("../controllers/merchantServices");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/merchantServices",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  merchantServicesController.getAllMerchantServices
);
router.get(
  "/merchantServices/:id",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  merchantServicesController.getOne
);
router.post(
  "/merchantServices",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  merchantServicesController.createOne
);
router.put(
  "/merchantServices/:merchantStoreServiceId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  merchantServicesController.updateOne
);
router.delete(
  "/merchantServices/:merchantStoreServiceId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  merchantServicesController.deleteOne
);
router.get(
  "/merchantServicesGroupByService",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  merchantServicesController.getMerchantServicesGroupByService
);

router.get(
  "/serviceCategories/:id",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  merchantServicesController.getAllServiceCategories
);

router.post(
  "/requestService",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  merchantServicesController.requestService
);

router.get(
  "/merchantServiceList",
  auth.merchantOrAdmin,
  merchantServicesController.merchantServiceList
);

router.get(
  "/nearbyMerchantStoreServices",
  merchantServicesController.getNearbyMerchantStoreServices
);

router.get(
  "/merchantStoresList",
  merchantServicesController.getMerchantStoresList
);

router.get("/globalSearch", merchantServicesController.getGlobalSearch);

router.get(
  "/merchantStoreServices/:merchantStoreServiceId",
  merchantServicesController.getMerchantStoreServicesByServiceId
);

module.exports = router;
