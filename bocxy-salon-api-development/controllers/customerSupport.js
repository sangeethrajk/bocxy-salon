const accountsService = require("../services/accounts");
const mailerService = require("../data/nodemailer");
const webRegistrationsService = require("../services/webRegistrations");
const fs = require("fs");
const moment = require("moment");

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

exports.sendCustomerSupporEmail = async (req, res, next) => {
  let response = {};
  response.data = [];
  try {
    let accountDetails = await accountsService.currentUserAccountDetails(
      req.user.accountId
    );
    console.log(accountDetails);
    email = "contact@bocxy.com";
    let content = fs.readFileSync("data/mail_templatesupport.html").toString();
    content = content
      .replace("{{{AccountID}}}", req.user.accountId)
      .replace("{{{Mobile}}}", accountDetails[0].mobileNo)
      .replace("{{{Name}}}", accountDetails[0].firstName)
      .replace("{{{Message}}}", req.body.Message);
    subject = req.body.Subject;
    exports.sendMail(email, subject, content);
    response.data = true;
    response.status = "SUCCESS";
  } catch (err) {
    console.log(err);
    response.status = "FAILURE";
    response.data = err;
  }
  res.status(200).json(response);
};

exports.sendRegisterEmail = async (req, res, next) => {
  let response = {};
  response.data = [];
  try {
    await webRegistrationsService.insertRegistration(
      req.body,
      moment().format("YYYY-MM-DD HH:mm:ss")
    );
    console.log(req.body);
    email = "contact@bocxy.com";
    let content = fs
      .readFileSync("data/mail_template_web_registration.html")
      .toString();
    content = content
      .replace("{{{firstName}}}", req.body.firstName)
      .replace("{{{lastName}}}", req.body.lastName)
      .replace("{{{mobileNo}}}", req.body.mobileNo)
      .replace("{{{email}}}", req.body.email)
      .replace("{{{region}}}", req.body.region)
      .replace("{{{description}}}", req.body.description);
    subject = req.body.Subject;
    exports.sendMail(email, subject, content);
    response.data = true;
    response.status = "SUCCESS";
  } catch (err) {
    console.log(err);
    response.status = "FAILURE";
    response.data = err;
  }
  res.status(200).json(response);
};
