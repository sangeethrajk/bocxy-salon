const router = require("express").Router();
const professionistGradesController = require("../controllers/professionistGrades");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

router.get(
  "/professionistGrades",
  auth.merchantOrAdmin,
  auth.permissionsAuth([
    constants.permissions.SERVICE_MANAGEMENT,
    constants.permissions.STYLIST_MANAGEMENT,
  ]),
  professionistGradesController.getProfessionistGrades
);

router.post(
  "/professionistGrades",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  professionistGradesController.insertProfessionistGrade
);

router.put(
  "/professionistGrades/:professionistGradeId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  professionistGradesController.updateProfessionistGrade
);

router.delete(
  "/professionistGrades/:professionistGradeId",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.SERVICE_MANAGEMENT]),
  professionistGradesController.deleteProfessionistGrade
);

module.exports = router;
