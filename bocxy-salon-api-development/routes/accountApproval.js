const router = require("express").Router();
const accountApprovalController = require("../controllers/accountApproval");
const auth = require("../controllers/authcheck");

router.get("/accountapproval", accountApprovalController.accountApprovalUpdate);

module.exports = router;
