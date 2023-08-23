const router = require("express").Router();
const genderCategoriesController = require("../controllers/genderCategories");
const auth = require("../controllers/authcheck");

router.post(
  "/genderCategories",
  auth.merchant,
  genderCategoriesController.createOne
);

router.put(
  "/genderCategories/:id",
  auth.merchant,
  genderCategoriesController.updateOne
);

router.delete(
  "/genderCategories/:id",
  auth.merchant,
  genderCategoriesController.deleteOne
);

router.get(
  "/genderCategories",
  auth.merchant,
  genderCategoriesController.getAll
);

router.get(
  "/genderCategories/:id",
  auth.merchant,
  genderCategoriesController.getOne
);

router.get("/genderCategoriesList", genderCategoriesController.getAllList);

module.exports = router;
