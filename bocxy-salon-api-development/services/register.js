const registerService = require("./register");
const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const accountsModel = require("../models/accounts");
const accountProfilesModel = require("../models/accountProfiles");
const merchantStoresModel = require("../models/merchantStores");
const accountSecurityQuestionsModel = require("../models/accountSecurityQuestions");
const merchantMapsModel = require("../models/merchantMaps");
const accountRolesModel = require("../models/accountRoles");
const rolesModel = require("../models/roles");
const constants = require("../data/constants");
const emailServer = require("../data/nodemailer");
const commonService = require("./common");
const qs = require("qs");
const secretKey = require("../data/secretKey");
const moment = require("moment");
const knexnest = require("knexnest");
const professionistMapsModel = require("../models/professionistMaps");

exports.sendSms = (reqBody, otp, inputMessage) => {
  let config = {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  };
  let data = {
    apikey: constants.smsconstants.smsApiKey,
    numbers: reqBody.dialCode.substring(1) + reqBody.mobileNo,
    message: inputMessage
      ? inputMessage
      : constants.smsconstants.smsMessage + otp,
    sender: constants.smsconstants.smsSender,
  };
  try {
    let response = commonService.axiosPostRequest(
      "register",
      constants.smsconstants.smsApiUrl,
      qs.stringify(data),
      config
    );
    return response;
  } catch (error) {
    console.log("register text local otp send failed" + error);
    throw Error(error);
  }
};

exports.sendSms2 = (reqBody, type, otp) => {
  try {
    let response;
    if (type === "OTP") {
      let config = {
        "content-type": "application/json",
      };
      let data = {
        authkey: constants.msg91Constants.authKey,
        mobile: reqBody.dialCode.substring(1) + reqBody.mobileNo,
      };
      data.extra_param = '{"COMPANY_NAME":"Bocxy"}';
      data.template_id = constants.msg91Constants.templateIdForOtp;
      data.otp = otp;
      response = commonService.axiosGetRequest(
        type,
        constants.msg91Constants.apiUrl + "otp",
        data,
        config
      );
    } else if (type === "PARTNER_LINK") {
      let config = {
        headers: {
          authkey: constants.msg91Constants.authKey,
          "content-type": "application/json",
        },
      };
      let data = {
        flow_id: constants.msg91Constants.flowIdForLink,
        recipients: [
          {
            mobiles: reqBody.dialCode.substring(1) + reqBody.mobileNo,
            android_url: constants.partnerAppAndroidLink,
            ios_url: constants.partnerAppIosLink,
          },
        ],
      };
      response = commonService.axiosPostRequest(
        type,
        constants.msg91Constants.apiUrl + "flow",
        data,
        config
      );
    } else if (type === "APPROVAL") {
      let config = {
        headers: {
          authkey: constants.msg91Constants.authKey,
          "content-type": "application/json",
        },
      };
      let data = {
        flow_id: constants.msg91Constants.flowIdforApproval,
        recipients: [
          {
            mobiles: "+91" + reqBody.mobileNo,
            android_url: constants.partnerAppAndroidLink,
            ios_url: constants.partnerAppIosLink,
          },
        ],
      };
      response = commonService.axiosPostRequest(
        type,
        constants.msg91Constants.apiUrl + "flow",
        data,
        config
      );
    } else if (type === "Onboard") {
      let config = {
        headers: {
          authkey: constants.msg91Constants.authKey,
          "content-type": "application/json",
        },
      };
      let data = {
        flow_id: constants.msg91Constants.flowIdforOnboard,
        recipients: [
          {
            mobiles: "+91" + "7550004999",
            storeName: reqBody[0].name,
            location: reqBody[0].location,
            mobileNum: reqBody[1].mobileNo,
            storeEmail: reqBody[0].email
              ? reqBody[0].email
              : reqBody[1].accountProfileEmail,
            contactName: reqBody[1].firstName,
          },
        ],
      };

      response = commonService.axiosPostRequest(
        type,
        constants.msg91Constants.apiUrl + "flow",
        data,
        config
      );
    }
    return response;
  } catch (error) {
    console.log("register text local otp send failed" + error);
    throw Error(error);
  }
};

exports.sendMail = (toEmail, subject, message) => {
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport(emailServer);
  var details = {
    from: emailServer.auth.user, // sender address same as above
    to: toEmail, // Receiver's email id with comma seperated values
    subject: subject, // Subject of the mail.
    html: message, // Sending OTP
  };
  transporter.sendMail(details, function (error, data) {
    if (error) console.log(error);
    else console.log(data);
  });
};

exports.insertAccount = async (reqBody, otp) => {
  try {
    let roleIdRow = [];
    if (reqBody.type == "MERCHANT") roleIdRow = await exports.getRoleId("MR");
    else if (reqBody.type == "USER") roleIdRow = await exports.getRoleId("CS");
    if (roleIdRow.length) {
      let accountId = await knex(accountsModel.table).insert({
        mobile_no: reqBody.mobileNo,
        mobile_no_dial_code: reqBody.dialCode,
        mobile_no_country_code: reqBody.countryCode,
        otp: otp,
        otp_timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        signup_flag: 0,
      });

      return knex(accountRolesModel.table).insert({
        account_id: accountId,
        role_id: roleIdRow[0].roleId, // For role Merchant
      });
    } else throw new Error("Invalid role");
  } catch (error) {
    console.log("insertAccount failed" + error);
    throw Error(error);
  }
};

exports.getRoleId = (roleCode) => {
  try {
    return knex
      .select(...rolesModel.selectOneFields(knex))
      .from(rolesModel.table)
      .where(rolesModel.columns[4].field, "Y")
      .andWhere(rolesModel.columns[2].field, roleCode);
  } catch (error) {
    console.log("getRoleId failed" + error);
    throw Error(error);
  }
};

exports.updateAccount = (reqBody, value) => {
  try {
    if (reqBody.isSubmit) {
      return knex(accountsModel.table)
        .update({
          password: knex.raw(
            `AES_ENCRYPT('${reqBody.password}', UNHEX(SHA2('${secretKey.salt}',512)))`
          ),
          signup_flag: 1,
        })
        .where("mobile_no", reqBody.mobileNo)
        .where("mobile_no_dial_code", reqBody.dialCode);
    } else if (value == "otpVerified") {
      return knex(accountsModel.table)
        .update({
          otp: null,
          otp_timestamp: null,
        })
        .where("mobile_no", reqBody.mobileNo)
        .where("mobile_no_dial_code", reqBody.dialCode);
    } else {
      return knex(accountsModel.table)
        .update({
          otp: value,
          otp_timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .where("mobile_no", reqBody.mobileNo)
        .where("mobile_no_dial_code", reqBody.dialCode);
    }
  } catch (error) {
    console.log("updateAccount failed" + error);
    throw Error(error);
  }
};

exports.sendRegistrationOrForgotEmail = async (reqBody, subject, message) => {
  let merchantRow = await exports.getMerchantStoreByMobileNo(
    reqBody.mobileNo,
    reqBody.dialCode
  );
  // if (
  //   merchantRow.length &&
  //   merchantRow[0].email !== "" &&
  //   merchantRow[0].email !== null
  // )
  //   exports.sendMail(merchantRow[0].email, subject, message);
};

exports.sendUserRegistrationOrForgotEmail = async (
  reqBody,
  subject,
  message
) => {
  let userRow = await exports.getUserByMobileNo(
    reqBody.mobileNo,
    reqBody.dialCode
  );
  // if (userRow.length && userRow[0].email !== "" && userRow[0].email !== null)
  // exports.sendMail(userRow[0].email, subject, message);
};

exports.getUserByMobileNo = (mobileNo, dialCode) => {
  try {
    return knex
      .select("ap.email as email")
      .from(accountsModel.table + " as a")
      .join(
        accountProfilesModel.table + " as ap",
        "a.account_id",
        "=",
        "ap.account_id"
      )
      .where("a.mobile_no", mobileNo)
      .where("a.mobile_no_dial_code", dialCode);
  } catch (error) {
    console.log("getUserByMobileNo failed" + error);
    throw Error(error);
  }
};

exports.getMerchantStoreByMobileNo = (mobileNo, dialCode) => {
  try {
    return knex
      .select("ms.email as email")
      .from(accountsModel.table + " as a")
      .join(
        merchantMapsModel.table + " as mm",
        "mm.account_id",
        "=",
        "a.account_id"
      )
      .join(
        merchantStoresModel.table + " as ms",
        "ms.merchant_store_id",
        "=",
        "mm.merchant_store_id"
      )
      .where("a.mobile_no", mobileNo)
      .where("a.mobile_no_dial_code", dialCode);
  } catch (error) {
    console.log("getMerchantStoreByMobileNo failed" + error);
    throw Error(error);
  }
};

exports.getAccountRow = (mobileNo, dialCode) => {
  try {
    return knex
      .select(...accountsModel.selectOneFields(knex))
      .from(accountsModel.table)
      .where(accountsModel.columns[1].field, mobileNo)
      .where(accountsModel.columns[2].field, dialCode);
  } catch (error) {
    console.log("getAccountRow failed" + error);
    throw Error(error);
  }
};

exports.getAccountRowWithRoleCode = async (mobileNo, dialCode) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "a.account_id as _accountId",
        "a.mobile_no as _mobileNo",
        "a.mobile_no_dial_code as _mobileNoDialCode",
        "a.active as _active",
        "a.signup_flag as _signupFlag",
        "r.code as _roleCodes__code"
      )
      .from(accountsModel.table + " as a")
      .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
      .join("m_roles as r", "r.role_id", "=", "ar.role_id")
      .where(accountsModel.columns[1].field, mobileNo)
      .where(accountsModel.columns[2].field, dialCode);

    await knexnest(selectQuery).then(function (data) {
      resultData = data;
      if (resultData && resultData.length && resultData[0].roleCodes) {
        resultData[0].roleCodes = data[0].roleCodes.map(function (code) {
          return code["code"];
        });
      }
    });

    return resultData ? resultData : [];
  } catch (error) {
    console.log("getAccountRowWithRoleCode failed" + error);
    throw Error(error);
  }
};

exports.checkAccountRow = (mobileNo, dialCode) => {
  try {
    return knex
      .select(...accountsModel.selectOneFields(knex))
      .from(accountsModel.table)
      .where(accountsModel.columns[1].field, mobileNo)
      .where(accountsModel.columns[2].field, dialCode)
      .where("signup_flag", 1);
  } catch (error) {
    console.log("checkAccountRow failed" + error);
    throw Error(error);
  }
};

exports.checkProfessionistAccountRow = (mobileNo, dialCode) => {
  try {
    return exports.getAccountRow(mobileNo, dialCode);
  } catch (error) {
    console.log("checkProfessionistAccountRow failed" + error);
    throw Error(error);
  }
};

exports.getAccountProfileRow = (accountId) => {
  try {
    return knex
      .select(...accountProfilesModel.selectOneFields(knex))
      .from(accountProfilesModel.table)
      .where(accountProfilesModel.columns[0].field, accountId);
  } catch (error) {
    console.log("getAccountProfileRow failed" + error);
    throw Error(error);
  }
};

exports.insertAccountProfile = (reqBody, accountId) => {
  try {
    if (reqBody.roleCodes.includes("MR")) {
      return knex(accountProfilesModel.table).insert({
        account_id: accountId,
        first_name: reqBody.firstName,
        last_name: reqBody.lastName,
        email: reqBody.email,
        address: reqBody.address,
      });
    } else {
      return knex(accountProfilesModel.table).insert(
        Object.assign(accountProfilesModel.checkFields(reqBody, false), {
          account_id: accountId,
          created_by: accountId,
        })
      );
    }
  } catch (error) {
    console.log("insertAccountProfile failed" + error);
    throw Error(error);
  }
};

exports.updateAccountProfile = (reqBody, accountId) => {
  try {
    if (reqBody.roleCodes.includes("MR")) {
      return knex(accountProfilesModel.table)
        .update({
          first_name: reqBody.firstName,
          last_name: reqBody.lastName,
          email: reqBody.email,
          address: reqBody.address,
        })
        .where("account_id", accountId);
    } else {
      return knex(accountProfilesModel.table)
        .update(
          Object.assign(accountProfilesModel.checkFields(reqBody, false), {
            updated_by: accountId,
          })
        )
        .where(accountProfilesModel.columns[0].field, accountId);
    }
  } catch (error) {
    console.log("updateAccountProfile failed" + error);
    throw Error(error);
  }
};

exports.insertOrUpdateMerchantStores = async (reqBody, accountId) => {
  try {
    return knex(merchantStoresModel.table).insert({
      store_type_id: reqBody.storeTypeId,
      name: reqBody.storeName,
      email: reqBody.storeEmail,
      address: reqBody.storeAddress,
      approval: "APPROVED",
      latitude: reqBody.latitude,
      longitude: reqBody.longitude,
      location: reqBody.locality
        ? reqBody.adminAreaLevel2
          ? reqBody.locality + ", " + reqBody.adminAreaLevel2
          : reqBody.locality
        : reqBody.adminAreaLevel2
        ? reqBody.adminAreaLevel2
        : reqBody.location,
      google_address: reqBody.googleAddress,
      place_id: reqBody.placeId,
      country: reqBody.country,
      admin_area_level_1: reqBody.adminAreaLevel1,
      admin_area_level_2: reqBody.adminAreaLevel2,
      locality: reqBody.locality,
      sub_locality: reqBody.subLocality,
      postal_code: reqBody.postalCode,
    });
  } catch (error) {
    console.log("insertmerchantStores failed" + error);
    throw Error(error);
  }
};

exports.insertOrUpdateAccountSecurityQuestions = async (
  securityQuestions,
  accountId
) => {
  try {
    return knex(accountSecurityQuestionsModel.table).insert({
      account_id: accountId,
      security_question_id: securityQuestions.securityQuestionId,
      answer: securityQuestions.answer,
      sequence: 1,
    });
  } catch (error) {
    console.log("insertOrUpdateAccountSecurityQuestions failed" + error);
    throw Error(error);
  }
};

exports.deleteAccountSecurityQuestions = (accountId) => {
  try {
    return knex(accountSecurityQuestionsModel.table)
      .where(accountSecurityQuestionsModel.columns[0].field, accountId)
      .del();
  } catch (error) {
    console.log("deleteAccountSecurityQuestions failed" + error);
    throw Error(error);
  }
};

exports.insertOrUpdatemerchantMaps = async (accountId, merchantStoreId) => {
  try {
    let merchantMaps = await exports.getMerchantMaps(accountId);
    if (merchantMaps.length) {
      return knex(merchantMapsModel.table)
        .update({
          merchant_store_id: merchantStoreId,
        })
        .where("account_id", accountId);
    } else {
      return knex(merchantMapsModel.table).insert({
        account_id: accountId,
        merchant_store_id: merchantStoreId,
      });
    }
  } catch (error) {
    console.log("insertOrUpdatemerchantMaps failed" + error);
    throw Error(error);
  }
};

exports.getMerchantMaps = (accountId) => {
  try {
    return knex
      .select(...merchantMapsModel.selectOneFields(knex))
      .from(merchantMapsModel.table)
      .where(merchantMapsModel.columns[0].field, accountId);
  } catch (error) {
    console.log("getMerchantMaps failed" + error);
    throw Error(error);
  }
};

exports.getAccountRowByAccountId = async (accountId) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "a.account_id as _accountId",
        "ap.first_name as _firstName",
        "a.mobile_no as _mobileNo",
        "a.mobile_no_dial_code as _mobileNoDialCode",
        "a.mobile_no_country_code as _mobileNoCountryCode",
        "a.active as _active",
        "a.signup_flag as _signupFlag",
        "r.code as _roleCodes__code"
      )
      .from(accountsModel.table + " as a")
      .join("m_account_profiles as ap", "ap.account_id", "=", "a.account_id")
      .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
      .join("m_roles as r", "r.role_id", "=", "ar.role_id")
      .where("a.account_id", accountId);

    await knexnest(selectQuery).then(function (data) {
      resultData = data;
      if (resultData && resultData.length && resultData[0].roleCodes) {
        resultData[0].roleCodes = data[0].roleCodes.map(function (code) {
          return code["code"];
        });
      }
    });

    return resultData ? resultData : [];
  } catch (error) {
    console.log("getAccountRowByAccountId failed" + error);
    throw Error(error);
  }
};

exports.getMerchantProfessionistMapsByStoreId = async (merchantStoreId) => {
  try {
    return knex.distinct("res.accountId").from(function () {
      this.select("pm.account_id as accountId")
        .from("m_professionist_maps as pm")
        .where("pm.merchant_store_id", merchantStoreId)
        .unionAll(function () {
          this.select("mm.account_id as accountId")
            .from("m_merchant_maps as mm")
            .where("mm.merchant_store_id", merchantStoreId);
        })
        .as("res");
    });
  } catch (error) {
    console.log("getMerchantProfessionistMapsByStoreId failed" + error);
    throw Error(error);
  }
};
exports.getMerchantInfo = (merchantStoreId) => {
  return knex
    .select(
      "merchant_store_id as merchantStoreId",
      "name as name",
      "email as email",
      "location as location"
    )
    .from("m_merchant_stores")
    .where("merchant_store_id", merchantStoreId)
    .andWhere("approval", "APPROVED");
};
exports.getAccountRole = async (mobileNo, dialCode) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "a.account_id as _accountId",
        "a.mobile_no as _mobileNo",
        "ap.email as _accountProfileEmail",
        "ap.first_name as _firstName"
      )
      .from(accountsModel.table + " as a")
      .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
      .join("m_account_profiles as ap", "ap.account_id", "=", "a.account_id")
      .where("a.mobile_no", mobileNo)
      .where("a.mobile_no_dial_code", dialCode);

    await knexnest(selectQuery).then(function (data) {
      resultData = data;
    });

    return resultData ? resultData : [];
  } catch (error) {
    console.log("getAccountRole failed" + error);
    throw Error(error);
  }
};
