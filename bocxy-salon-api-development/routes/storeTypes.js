const router = require("express").Router();
const storeController = require("../controllers/storeTypes");
const auth = require("../controllers/authcheck");

router.post("/storeTypes", auth.merchant, storeController.createOne);

router.put("/storeTypes/:id", auth.merchant, storeController.updateOne);

router.delete("/storeTypes/:id", auth.merchant, storeController.deleteOne);

router.get("/storeTypes", auth.merchant, storeController.getAll);

router.get("/storeTypesList", storeController.getAllList);

router.get("/storeTypes/:id", auth.merchant, storeController.getOne);

module.exports = router;
