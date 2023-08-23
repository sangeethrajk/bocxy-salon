const accountApprovalService = require("../services/accountApproval");
const registerService = require("../services/register");
const mailerService = require("../data/nodemailer");
var nodemailer = require("nodemailer");

exports.sendMail = (toEmail, subject, content) => {
  mailerService.emailServer().then((emailServer) => {
    var transporter = nodemailer.createTransport(emailServer);
    var details = {
      from: emailServer.user, // sender address same as above
      to: toEmail, // Receiver's email id with comma seperated values
      subject: subject, // Subject of the mail.
      html: content, // Sending OTP
    };
    transporter.sendMail(details, function (error, data) {
      if (error) console.log(error);
      else console.log(data);
    });
  });
};
module.exports = {
  accountApprovalUpdate: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if ((req.query.id = "855f74f4-5a88-4768-a401-22eb26dae0d0")) {
        let accountapproval = await accountApprovalService.getAccountRole(
          req.query.accountId
        );
        if (accountapproval[0].roleCodes[0] === 1) {
          let merchantMaps = await registerService.getMerchantMaps(
            req.query.accountId
          );
          console.log(merchantMaps[0].merchantStoreId);
          response.data = await accountApprovalService.updateAproval(
            req.query,
            merchantMaps[0].merchantStoreId
          );
          let merchantInfo = await accountApprovalService.getMerchantInfo(
            merchantMaps[0].merchantStoreId
          );
          if (merchantInfo.length) {
            registerService.sendSms2(accountapproval[0], "APPROVAL", null);
            if (merchantInfo[0].email != null && merchantInfo[0].email != "") {
              exports.sendMail(
                merchantInfo[0].email,
                "store has been approved from Bocxy",
                "Dear user, Your store has been approved from Bocxy. Please login to the app with registered credentials"
              );
            } else {
              exports.sendMail(
                accountapproval[0].accountProfileEmail,
                "store has been approved from Bocxy",
                "Dear user, Your store has been approved from Bocxy. Please login to the app with registered credentials"
              );
            }
          }
          response.data = "Updated Sucessfully for " + merchantInfo[0].name;
        }
        response.status = "SUCCESS";
      }
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
