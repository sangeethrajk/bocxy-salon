const multer = require("multer");

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // console.log(file,"---files")
    var datetimestamp = Date.now();
    cb(
      null,
      file.originalname.split(".")[file.originalname.split(".").length - 2] +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});
const DIR = "./uploads";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR);
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-');
//     cb(null, fileName)
//   }
// });

//  const uploadFilter = function (req, file, cb) { //file filter
//         if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {

//             cb('Invalid File', false);
//         }
//         cb(null, true);
//     }

//  var upload = multer({ //multer settings
//     storage: storage,
//     fileFilter: uploadFilter
// }).single('file');

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  // fileFilter: (req, file, cb) => {
  //   if (
  //     // file.mimetype == "image/png" ||
  //     // file.mimetype == "image/jpg" ||
  //     // file.mimetype == "image/jpeg" ||
  //     file.mimetype == ".doc" ||
  //     file.mimetype == "PDF" ||
  //     file.mimetype == "XLS "
  //   ) {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //     return cb(new Error("Only word,txt,PDF format allowed!"));
  //   }
  // },
}).fields([
  { name: "nvoc", maxCount: 1 },
  { name: "Cregister", maxCount: 1 },
  { name: "iso", maxCount: 1 },
  { name: "iata", maxCount: 1 },
  { name: "fiat", maxCount: 1 },
  { name: "wca", maxCount: 1 },
  { name: "others", maxCount: 1 },
]);
module.exports = upload;
