const router = require("express").Router();
const merchantStoreController = require("../controllers/merchantStores");

router.get(
  "/merchantStoreDetail/:merchantStoreId",
  merchantStoreController.getMerchantStores
);

module.exports = router;
