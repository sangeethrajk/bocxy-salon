const router = require("express").Router();
const serviceGroupsController = require("../controllers/serviceGroups");
const auth = require("../controllers/authcheck");

router.post("/serviceGroups", auth.admin, serviceGroupsController.createOne);

router.put("/serviceGroups/:id", auth.admin, serviceGroupsController.updateOne);

router.delete(
  "/serviceGroups/:id",
  auth.admin,
  serviceGroupsController.deleteOne
);

router.get("/serviceGroups",auth.admin, serviceGroupsController.getAll);

router.get("/serviceGroupList", serviceGroupsController.getAllList);


router.get("/serviceGroups/:id", auth.admin, serviceGroupsController.getOne);

module.exports = router;
