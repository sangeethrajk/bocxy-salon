module.exports = function sendMail(toEmail, subject, content) {
  const mailerService = require("../data/nodemailer");
  var nodemailer = require("nodemailer");
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

// module.exports = function sendMail(email, subject, html) {
//   var nodemailer = require("nodemailer");
//   const fs = require("fs");

//   var transporter = nodemailer.createTransport({
//     // service: "Godaddy",
//     host: "sg3plcpnl0219.prod.sin3.secureserver.net",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "contact@bocxy.com", //email ID
//       pass: "password", //Password
//     },
//   });
//   let content = fs.readFileSync("data/mail_template.html").toString();
//   content = content
//     .replace("{{{WELCOME_TEXT}}}", html.welcomeText)
//     .replace("{{{MAIN_CONTENT}}}", html.mainContent)
//     .replace("{{{THANK_YOU_TEXT}}}", html.thankYouText);
//   var details = {
//     from: "contact@bocxy.com", // sender address same as above
//     to: email, // Receiver's email id
//     subject: subject, // Subject of the mail.
//     html: content, // Sending OTP
//   };

//   transporter.sendMail(details, function (error, data) {
//     if (error) console.log(error);
//     else console.log(data);
//   });
// };
