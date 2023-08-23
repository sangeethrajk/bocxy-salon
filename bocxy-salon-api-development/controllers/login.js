const loginService = require("../services/login");
const accountsService = require("../services/accounts");
const adminAccountsService = require("../services/adminAccounts");
const registerService = require("../services/register");
const commonService = require("../services/common");
const jwt = require("jsonwebtoken");
const tokenKey = require("../data/tokenKey");
const secretKey = require("../data/secretKey");
const constants = require("../data/constants");

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, tokenKey.key, async (err, payload) => {
          if (payload) {
            if (payload.type === "USER" || payload.type === "MERCHANT") {
              const userData = await accountsService.getAccount(payload.id);
              if (userData.length) {
                req.user = userData[0];
                req.user.type = payload.type;
              }
            } else {
              const userData = await adminAccountsService.getAdmin(payload.id);
              if (userData.length) {
                req.user = userData[0];
                req.user.type = payload.type;
              }
            }
            next();
          } else {
            next();
          }
        });
      } else {
        next();
      }
    } catch (e) {
      next();
    }
  },

  login: async (req, res, next) => {
    const mobileNo = req.body.mobileNo;
    const Password = req.body.password;
    const dialCode = req.body.dialCode;
    const type = req.body.type;
    let mobileNoCheck;
    let productResult = {};
    productResult.data = {};
    try {
      const salt = secretKey.salt;
      // Check Username
      if (type === "USER") {
        mobileNoCheck = await loginService.checkAccount(
          mobileNo,
          dialCode,
          constants.roles.userRoles
        );
      } else if (type === "MERCHANT") {
        mobileNoCheck = await loginService.checkAccount(
          mobileNo,
          dialCode,
          constants.roles.merchantRoles
        );
      } else if (type === "ADMIN")
        mobileNoCheck = await loginService.checkAdminUserName(mobileNo);
      if (mobileNoCheck.length > 0) {
        if (
          ((type === "USER" || type === "MERCHANT") &&
            mobileNoCheck[0].signupFlag === 1) ||
          type === "ADMIN"
        ) {
          // Check account is active
          if (mobileNoCheck[0].active === "Y") {
            // Check Username with Password
            if (type === "ADMIN")
              user = await loginService.checkAdminLogin(
                mobileNo,
                Password,
                salt
              );
            else user = await loginService.checkLogin(mobileNo, Password, salt);

            if (user.length > 0) {
              let storeApproval;
              if (type === "MERCHANT")
                storeApproval = await loginService.getMerchantStoreApprovalStatus(
                  user[0].accountId,
                  user[0].roleCodes
                );
              if (
                (type === "MERCHANT" &&
                  storeApproval &&
                  storeApproval.length &&
                  storeApproval[0].approval === "APPROVED") ||
                type === "USER" ||
                type === "ADMIN"
              ) {
                let firstlogValue;
                if (req.body.type === "MERCHANT") {
                  getFirstLogins = await loginService.getFirstLogin(
                    mobileNo,
                    dialCode
                  );
                  firstlogValue = getFirstLogins[0].first_login;
                }

                const expiresIn = 24 * 60 * 60;
                const obj = {
                  id: type === "ADMIN" ? user[0].adminId : user[0].accountId,
                  type: type,
                };
                // unlimited expiration
                const accessToken = jwt.sign(obj, tokenKey.key, {});

                // const accessToken = jwt.sign(obj, tokenKey.key, {
                //   expiresIn: expiresIn,
                // });
                productResult.status = "SUCCESS";
                if (type === "MERCHANT")
                  productResult.data = {
                    accessToken,
                    expiresIn,
                    firstlogValue,
                  };
                else productResult.data = { accessToken, expiresIn };
              } else {
                let status = "PENDING";
                if (storeApproval && storeApproval.length)
                  status = storeApproval[0].approval;
                productResult.status = "FAILURE";
                productResult.data = {
                  username: false,
                  activeFlag: false,
                  password: false,
                  storeApproval: status,
                  data: "Account status is " + status,
                };
              }
            } else {
              productResult.status = "FAILURE";
              productResult.data = {
                username: false,
                activeFlag: false,
                password: true,
                data: "Incorrect Passwrod",
              };
            }
          } else {
            productResult.status = "FAILURE";
            productResult.data = {
              username: false,
              activeFlag: true,
              password: true,
              data: "Account Disabled",
            };
          }
        } else {
          productResult.status = "FAILURE";
          productResult.data = {
            username: false,
            signupFlag: true,
            activeFlag: true,
            password: true,
            data: "Partial Signup",
          };
        }
      } else {
        productResult.status = "FAILURE";
        productResult.data = {
          username: true,
          activeFlag: true,
          password: true,
          data: "Account not exist",
        };
      }
    } catch (err) {
      console.log(err);
      productResult.status = "FAILURE";
      productResult.data = err;
    }
    res.status(200).json(productResult);
  },
  forgotPassword: async (req, res, next) => {
    let forgetPassresult = {};
    forgetPassresult.data = {};
    let reqBody = req.body;
    try {
      if (reqBody.mobileNo) {
        let accountRow = await registerService.getAccountRow(
          reqBody.mobileNo,
          reqBody.dialCode
        );
        if (accountRow.length) {
          let otp = await commonService.generateOtp();
          await registerService.updateAccount(reqBody, otp);
          registerService.sendSms2(reqBody, "OTP", otp);
          forgetPassresult.data = true;
          forgetPassresult.status = "SUCCESS";
        } else {
          forgetPassresult.status = "FAILURE";
          forgetPassresult.data = "Mobile number does not exists";
        }
      } else {
        forgetPassresult.status = "FAILURE";
        forgetPassresult.data = "Mobile number is empty";
      }
    } catch (err) {
      forgetPassresult.status = "FAILURE";
      forgetPassresult.error = true;
      forgetPassresult.errorMessage = err;
    }
    res.status(200).json(forgetPassresult);
  },
  getAccountSecurityQuestions: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.query.mobileNo) {
        let accountRow = await registerService.getAccountRow(
          req.query.mobileNo,
          req.query.dialCode
        );
        if (accountRow.length) {
          response.data = await loginService.getAccountSecurityQuestions(
            req.query.mobileNo,
            req.query.dialCode
          );
          response.status = "SUCCESS";
        } else {
          response.data = false;
          response.status = "FAILURE";
        }
      } else {
        response.data = false;
        response.status = "FAILURE";
      }
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  checkAccountSecurityQuestion: async (req, res, next) => {
    let response = {};
    response.data = [];
    let reqBody = req.body;
    try {
      if (reqBody.mobileNo) {
        let accountRow = await registerService.getAccountRow(
          reqBody.mobileNo,
          reqBody.dialCode
        );
        if (accountRow.length) {
          let securityData = await loginService.checkAccountSecurityQuestion(
            accountRow[0].accountId,
            reqBody
          );
          response.data = securityData.length ? true : false;
          response.status = securityData.length ? "SUCCESS" : "FAILURE";
        } else {
          response.data = false;
          response.status = "FAILURE";
        }
      } else {
        response.data = false;
        response.status = "FAILURE";
      }
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getSecurityQuestions: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await loginService.getSecurityQuestions();
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getAppVersion: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await loginService.getAppVersion(req.params.type);
      if (response.data.length) {
        response.data = response.data[0];
      }
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
