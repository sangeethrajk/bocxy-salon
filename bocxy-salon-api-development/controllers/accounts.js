const accountsService = require("../services/accounts");
const adminAccountsService = require("../services/adminAccounts");
const registerService = require("../services/register");
const loginService = require("../services/login");
const commonService = require("../services/common");
const createPasswordService = require("../services/create-password");
const moment = require("moment");
const constants = require("../data/constants");

module.exports = {
  getAllRegister: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;

    try {
      const resData = await accountsService.getAccounts(req.query);
      response.data = resData.length > 0 ? resData : [];
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }

    res.status(statusCode).json(response);
  },
  getCurrentAdmin: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      response.data = await adminAccountsService.getCurrentAdmin(
        req.user.adminId
      );
      if (response.data.length > 0) {
        response.data = response.data[0];
        if (response.data.active == "N") {
          throw new Error("Account Disabled");
        }
        response.status = "SUCCESS";
      } else {
        throw new Error("Account Not Exist");
      }
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },
  getCurrentUser: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      response.data = await adminAccountsService.getCurrentUser(
        req.user.accountId
      );
      if (response.data.length > 0) {
        response.data = response.data[0];
        if (response.data.active == "N") {
          throw new Error("User Account Disabled");
        }
        if (response.data.pictureType === "PICTURE") {
          let pictureUrl = response.data.pictureUrl.split("/profile-pictures");
          if (pictureUrl && pictureUrl.length > 1) {
            let thumbnailUrl =
              pictureUrl[0] + "/profile-pictures/thumbnails" + pictureUrl[1];
            const s3 = await commonService.newAwsS3();
            response.data.pictureUrl = await commonService.getSignedUrl(
              s3,
              thumbnailUrl
            );
          }
        }
        response.status = "SUCCESS";
      } else {
        throw new Error("User Account Does Not Exist");
      }
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },
  checkAccountExist: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const resData = await registerService.checkAccountRow(
        req.query.mobileNo,
        req.query.dialCode
      );
      response.data =
        resData.length > 0 && resData[0].active === "Y" ? true : false;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  accountPasswordUpdate: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const resData = await registerService.getAccountRow(
        req.body.mobileNo,
        req.body.dialCode
      );
      if (resData.length) {
        await createPasswordService.updatePassword(
          resData[0].accountId,
          req.body.password
        );
        registerService.sendRegistrationOrForgotEmail(
          req.body,
          "Password Update",
          "Account Password Updated Successfully"
        );
        response.data = true;
        response.status = "SUCCESS";
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
  accountSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    let reqBody = req.body;
    try {
      if (req.user.accountId) {
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
        await accountsService.insertOrUpdateMerchantSlot(
          req.user.accountId,
          reqBody,
          req.user.type
        );
        await loginService.ChangeFirst(req.user.accountId);
        response.data = true;
        response.status = "SUCCESS";
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
  checkProfessionistAccountExist: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const resData = await registerService.checkProfessionistAccountRow(
        req.query.mobileNo,
        req.query.dialCode
      );
      response.data =
        resData.length > 0 && resData[0].active === "Y" ? true : false;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  profileUpdate: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      if (req.body.pictureType === "PICTURE") {
        if (req.body.picture) {
          const s3 = commonService.newAwsS3();
          const picture = req.body.picture
            ? commonService.parseBase64(
                req.body.picture,
                "profilepicture",
                "profile-pictures"
              )
            : null;
          const displayImageThumbnail = picture
            ? await commonService.createThumbnail(picture)
            : null;
          req.body.pictureUrl = picture
            ? await commonService.uploadToS3(s3, picture)
            : null;
          if (displayImageThumbnail)
            await commonService.uploadToS3(s3, displayImageThumbnail);
        }
      } else {
        req.body.pictureUrl = req.body.picture;
      }
      await accountsService.profileUpdate(req.body, userId, req.user.type);
      response.data = true;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  currentUserAccountDetails: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      response.data = await accountsService.currentUserAccountDetails(
        req.user.accountId
      );
      if (response.data.length > 0) {
        response.data = response.data[0];
        if (response.data.active == "N") {
          throw new Error("User Account Disabled");
        }
        if (response.data.pictureType === "PICTURE") {
          let pictureUrl = response.data.pictureUrl.split("/profile-pictures");
          if (pictureUrl && pictureUrl.length > 1) {
            let thumbnailUrl =
              pictureUrl[0] + "/profile-pictures/thumbnails" + pictureUrl[1];
            const s3 = await commonService.newAwsS3();
            response.data.pictureUrl = await commonService.getSignedUrl(
              s3,
              response.data.pictureUrl
            );
            response.data.thumbnailUrl = await commonService.getSignedUrl(
              s3,
              thumbnailUrl
            );
          }
        }
        response.status = "SUCCESS";
      } else {
        throw new Error("User Account Does Not Exist");
      }
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },
  profilePasswordUpdate: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      await accountsService.profilePasswordUpdate(req.user.accountId, req.body);
      response.data = true;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  profileVerifyOtp: async (req, res, next) => {
    let response = {};
    response.data = [];
    let reqBody = req.body;
    try {
      if (reqBody.otp !== undefined && reqBody.otp !== "") {
        let accountRow = await accountsService.getAccountRole(
          req.user.accountId
        );
        if (accountRow.length && accountRow[0].otp == reqBody.otp) {
          var currentDate = new Date(moment().format("YYYY-MM-DD HH:mm:ss"));
          var otpTimestamp = new Date(accountRow[0].otpTimestamp);
          timeDiff = Math.floor((currentDate - otpTimestamp) / 1000);
          if (
            timeDiff > 0 &&
            timeDiff <= constants.smsconstants.smsOtpTimeOut
          ) {
            response.data = true;
          } else {
            response.data = false;
          }
        } else {
          response.data = false;
        }
      } else {
        response.data = "Otp is empty";
      }
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  profileOtp: async (req, res, next) => {
    let response = {};
    response.data = [];
    let reqBody = req.body;
    try {
      let accountRow = await accountsService.getAccountRole(req.user.accountId);
      if (accountRow.length) {
        reqBody.mobileNo = accountRow[0].mobileNo;
        reqBody.dialCode = accountRow[0].mobileNoDialCode;
        let otp = await commonService.generateOtp();
        response.data = await accountsService.updateProfileOtp(
          req.user.accountId,
          otp
        );
        response.data = true;
        registerService.sendSms2(reqBody, "OTP", otp);
      } else {
        response.data = "Account does not exist";
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
