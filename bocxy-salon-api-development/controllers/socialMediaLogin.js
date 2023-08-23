const loginService = require("../services/socialMediaLogin");
const registerService = require("../services/register");

const jwt = require("jsonwebtoken");
const tokenKey = require("../data/tokenKey");
const constants = require("../data/constants");
const moment = require("moment");

module.exports = {
  login: async (req, res, next) => {
    const userId = req.body.userId;
    const type = req.body.type;
    let userIdCheck;
    let tableName;
    let productResult = {};
    productResult.data = {};
    try {
      if (type === "FACEBOOK") {
        tableName = "m_account_facebook_data";
      } else if (type === "GOOGLE") {
        tableName = "m_account_google_data";
      } else {
        tableName = "";
      }
      userIdCheck = await loginService.checkAccount(userId, tableName);
      if (userIdCheck.length > 0) {
        const expiresIn = 24 * 60 * 60;
        const obj = {
          id: userIdCheck[0].accountId,
          type: "USER",
        };
        // unlimited expiration
        const accessToken = jwt.sign(obj, tokenKey.key, {});
        productResult.status = "SUCCESS";
        productResult.data = {
          accessToken,
          expiresIn,
        };
      } else {
        productResult.status = "FAILURE";
        productResult.data = {
          accountStatus: "Account not exist",
        };
      }
    } catch (err) {
      console.log(err);
      productResult.status = "FAILURE";
      productResult.data = err;
    }
    res.status(200).json(productResult);
  },

  register: async (req, res, next) => {
    let tableName;
    let response = {};
    response.data = {};
    try {
      if (req.body.type === "FACEBOOK") {
        tableName = "m_account_facebook_data";
      } else if (type === "GOOGLE") {
        tableName = "m_account_google_data";
      } else {
        tableName = "";
      }
      if (req.body.mobileNo !== undefined && req.body.mobileNo !== "") {
        if (req.body.otp !== undefined && req.body.otp !== "") {
          let accountRow = await registerService.getAccountRow(
            req.body.mobileNo,
            req.body.dialCode
          );
          if (accountRow.length && accountRow[0].signupFlag == 0) {
            if (accountRow[0].otp == req.body.otp) {
              var currentDate = new Date(
                moment().format("YYYY-MM-DD HH:mm:ss")
              );
              var otpTimestamp = new Date(accountRow[0].otpTimestamp);
              timeDiff = Math.floor((currentDate - otpTimestamp) / 1000);
              if (
                timeDiff > 0 &&
                timeDiff <= constants.smsconstants.smsOtpTimeOut
              ) {
                let accountId = accountRow[0].accountId;
                await loginService.insertSocialMediaAccount(
                  req.body,
                  accountId,
                  tableName
                );
                await loginService.insertAccountProfile(req.body, accountId);
                await loginService.updateAccount(req.body, accountId);
                const expiresIn = 24 * 60 * 60;
                const obj = {
                  id: accountId,
                  type: "USER",
                };
                // unlimited expiration
                const accessToken = jwt.sign(obj, tokenKey.key, {});
                response.status = "SUCCESS";
                response.data = {
                  accessToken,
                  expiresIn,
                };
              } else {
                response.status = "FAILURE";
                response.data = {
                  message: "invalidOtp",
                  accountError: false,
                  invalidOtp: true,
                };
              }
            } else {
              response.status = "FAILURE";
              response.data = {
                message: "invalidOtp",
                accountError: false,
                invalidOtp: true,
              };
            }
          } else {
            response.status = "FAILURE";
            response.data = {
              message: "Problem creating account",
              accountError: true,
              invalidOtp: false,
            };
          }
        } else {
          response.status = "FAILURE";
          response.data = {
            message: "invalidOtp",
            accountError: false,
            invalidOtp: true,
          };
        }
      } else {
        response.status = "FAILURE";
        response.data = {
          message: "Problem creating account",
          accountError: true,
          invalidOtp: false,
        };
      }
    } catch (err) {
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
