const registerService = require("../services/register");
const commonService = require("../services/common");
const constants = require("../data/constants");
const sendMailController = require("../controllers/sendMail");
const moment = require("moment");

module.exports = {
  register: async (req, res, next) => {
    let response = {};
    response.data = {};
    let result;
    let roleCodes;
    let reqBody = req.body;
    try {
      if (reqBody.mobileNo) {
        let accountRow = await registerService.getAccountRowWithRoleCode(
          reqBody.mobileNo,
          reqBody.dialCode
        );
        if (!accountRow.length) {
          let otp = await commonService.generateOtp();
          response.data.data = await registerService.insertAccount(
            reqBody,
            otp
          );
          result = true;
          roleCodes = null;
          //registerService.sendSms(reqBody, otp);
        } else if (reqBody.isSubmit) {
          response.data.data = await registerService.updateAccount(reqBody, "");
          if (accountRow[0].roleCodes.includes("MR")) {
            registerService.sendRegistrationOrForgotEmail(
              reqBody,
              "Registration Completed",
              "Store Registration Success"
            );
            let accountDetails = await registerService.getAccountRole(
              reqBody.mobileNo,
              reqBody.dialCode
            );
            if (accountDetails) {
              let merchantMaps = await registerService.getMerchantMaps(
                accountDetails[0].accountId
              );
              let merchantInfo = await registerService.getMerchantInfo(
                merchantMaps[0].merchantStoreId
              );
              if (merchantInfo.length) {
                let onBoardData = merchantInfo.concat(accountDetails);
                registerService.sendSms2(onBoardData, "Onboard", null);
                if (
                  merchantInfo[0].email != null &&
                  merchantInfo[0].email != ""
                ) {
                  sendMailController(
                    "raj@bocxy.com",
                    "Bocxy - New Partner Onboard",
                    "Woohoo!.. New partner onboarded to bocxy <br>" +
                      "Store Name: " +
                      merchantInfo[0].name +
                      "  <br>" +
                      "Store Email: " +
                      merchantInfo[0].email +
                      "<br>" +
                      "Mobile Number : " +
                      accountDetails[0].mobileNo +
                      "<br>" +
                      "location :" +
                      merchantInfo[0].location +
                      "<br>" +
                      "Contact Name :" +
                      accountDetails[0].firstName +
                      "<br>"
                  );
                } else {
                  sendMailController(
                    "raj@bocxy.com",
                    "Bocxy - New Partner Onboard",
                    "Woohoo!.. New partner onboarded to bocxy <br>" +
                      "Store Name: " +
                      merchantInfo[0].name +
                      "<br>" +
                      "Store Email: " +
                      accountDetails[0].accountProfileEmail +
                      "<br>" +
                      "Mobile Number : " +
                      accountDetails[0].mobileNo +
                      "<br>" +
                      "location :" +
                      merchantInfo[0].location +
                      "<br>" +
                      "Contact Name :" +
                      accountDetails[0].firstName +
                      "<br>"
                  );
                }
              }
            }
          } else if (reqBody.type == "USER") {
            registerService.sendUserRegistrationOrForgotEmail(
              reqBody,
              "Registration Completed",
              "Registration Success"
            );
          }
          result = true;
          roleCodes = null;
        } else if (accountRow[0].signupFlag === 0) {
          let otp = await commonService.generateOtp();
          response.data.data = await registerService.updateAccount(
            reqBody,
            otp
          );
          result = true;
          roleCodes = accountRow[0].roleCodes;
          registerService.sendSms2(reqBody, "OTP", otp);
        } else {
          result = "Mobile number already exists";
        }
      } else {
        result = "Mobile number is empty";
      }
      response.data.data = result;
      response.data.roleCodes = roleCodes;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  registerProfile: async (req, res, next) => {
    let response = {};
    response.data = [];
    let result;
    let reqBody = req.body;
    try {
      if (reqBody.mobileNo !== undefined && reqBody.mobileNo !== "") {
        let accountRow = await registerService.getAccountRowWithRoleCode(
          reqBody.mobileNo,
          reqBody.dialCode
        );
        if (accountRow.length) {
          if (accountRow[0].signupFlag == 0) {
            let accountId = accountRow[0].accountId;
            let accountProfileRow = await registerService.getAccountProfileRow(
              accountId
            );
            if (reqBody.firstName !== undefined && reqBody.firstName !== "") {
              reqBody.roleCodes = accountRow[0].roleCodes;
              if (accountProfileRow.length) {
                response.data = await registerService.updateAccountProfile(
                  reqBody,
                  accountId
                );
              } else {
                response.data = await registerService.insertAccountProfile(
                  reqBody,
                  accountId
                );
              }
            }
            if (
              accountRow[0].roleCodes.includes("MR") &&
              reqBody.storeName !== undefined &&
              reqBody.storeName !== ""
            ) {
              response.data = await registerService.insertOrUpdateMerchantStores(
                reqBody,
                accountId
              );
              await registerService.insertOrUpdatemerchantMaps(
                accountId,
                response.data[0]
              );
            }
            if (reqBody.securityQuestions && reqBody.securityQuestions.length) {
              await registerService.deleteAccountSecurityQuestions(accountId);
              reqBody.securityQuestions.forEach(async (element) => {
                await registerService.insertOrUpdateAccountSecurityQuestions(
                  element,
                  accountId
                );
              });
            }
            result = true;
          } else {
            result = "Account exists already";
          }
        } else {
          result = "Account needs to be created first";
        }
      } else {
        result = "Mobile number is empty";
      }
      response.data = result;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  verifyOtp: async (req, res, next) => {
    let response = {};
    response.data = [];
    let reqBody = req.body;
    try {
      if (reqBody.mobileNo && reqBody.Otp !== undefined && reqBody.Otp !== "") {
        let accountRow = await registerService.getAccountRow(
          reqBody.mobileNo,
          reqBody.dialCode
        );
        if (accountRow.length && accountRow[0].otp == reqBody.Otp) {
          var currentDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss"));
          var otpTimestamp = new Date(accountRow[0].otpTimestamp);
          timeDiff = Math.floor((currentDate - otpTimestamp) / 1000);
          if (
            timeDiff > 0 &&
            timeDiff <= constants.smsconstants.smsOtpTimeOut
          ) {
            await registerService.updateAccount(reqBody, "otpVerified");
            response.data = true;
          } else {
            response.data = false;
          }
        } else {
          response.data = false;
        }
      } else {
        response.data = "Mobile number or otp is empty";
      }
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  resendOtp: async (req, res, next) => {
    let response = {};
    response.data = [];
    let result;
    let reqBody = req.body;
    try {
      if (reqBody.mobileNo) {
        let accountRow = await registerService.getAccountRow(
          reqBody.mobileNo,
          reqBody.dialCode
        );
        if (accountRow.length) {
          let otp = await commonService.generateOtp();
          response.data = await registerService.updateAccount(reqBody, otp);
          result = true;
          registerService.sendSms2(reqBody, "OTP", otp);
        } else {
          result = "Mobile number does not exists";
        }
      } else {
        result = "Mobile number is empty";
      }
      response.data = result;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
