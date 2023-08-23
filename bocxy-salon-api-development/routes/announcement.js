const router = require("express").Router();
const annoucementController = require("../controllers/announcement");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

//router.get("/genders", annoucementController.getAll);

//router.get("/genders/:id", auth.any, annoucementController.getOne);
router.post(
  "/createAnnoucements",
  auth.merchantOrAdmin,
  auth.permissionsAuth([constants.permissions.ANNOUNCEMENT_MANAGEMENT]),
  annoucementController.createOne
);

router.get(
  "/getAnnoucement/:annoucementId",
  auth.user,
  annoucementController.getOne
);
// app.post('/product', function(req, res){
//     //...
// });

// app.put('/product', function(req, res){
//     //...
// });

// app.delete('/product', function(req, res){
//     //...
// });

module.exports = router;
