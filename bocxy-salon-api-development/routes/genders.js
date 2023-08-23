const router = require("express").Router();
const genderController = require("../controllers/genders");
const auth = require("../controllers/authcheck");

router.get("/genders", genderController.getAll);

router.get("/genders/:id", auth.any, genderController.getOne);

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
