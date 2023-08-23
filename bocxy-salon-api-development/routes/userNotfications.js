const router = require("express").Router();
const notificationController = require("../controllers/userNotfications");
const auth = require("../controllers/authcheck");
const constants = require("../data/constants");

//router.get("/genders", annoucementController.getAll);

//router.get("/genders/:id", auth.any, annoucementController.getOne);
router.post("/notfications", auth.any, notificationController.registerNew);
router.post(
  "/Merchantnotfications",
  auth.any,
  notificationController.registerNewMerchant
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
