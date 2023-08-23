const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);

const accountSecurityQuestionsModel = require("../models/accountSecurityQuestions");
const securityQuestionsModel = require("../models/securityQuestions");
const knexnest = require("knexnest");
const appConfigModel = require("../models/appConfig");
const accountsModel = require("../models/accounts");

exports.checkLogin = async (mobileNo, password, salt) => {
  let resultData = [];
  let selectQuery = knex
    .select(
      "a.account_id as _accountId",
      "a.mobile_no as _mobile_no",
      "a.active as _active",
      "r.code as _roleCodes__code"
    )
    .from("m_accounts as a")
    .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
    .join("m_roles as r", "r.role_id", "=", "ar.role_id")
    .where(function () {
      this.where("mobile_no", mobileNo);
    })
    .andWhereRaw("password = AES_ENCRYPT(?, UNHEX(SHA2(?,512)))", [
      password,
      salt,
    ]);

  await knexnest(selectQuery).then(function (data) {
    resultData = data;
    if (resultData && resultData.length && resultData[0].roleCodes) {
      resultData[0].roleCodes = data[0].roleCodes.map(function (code) {
        return code["code"];
      });
    }
  });

  return resultData ? resultData : [];
};

exports.checkAdminLogin = (username, password, salt) =>
  knex
    .select(
      "admin_id AS adminId",
      "username",
      "email",
      "admin_role_id AS adminRoleId",
      "active"
    )
    .from("m_admins")
    .where(function () {
      this.where("username", username).orWhere("email", username);
    })
    .andWhereRaw("password = AES_ENCRYPT(?, UNHEX(SHA2(?,512)))", [
      password,
      salt,
    ]);

exports.checkUserName = (email) =>
  knex
    .select("active")
    .from("m_accounts")
    .where(function () {
      this.where("email", email);
    })
    .whereNull("otp");

exports.checkAdminUserName = (email) =>
  knex
    .select("active")
    .from("m_admins")
    .where(function () {
      this.where("email", email).orWhere("username", email);
    });

exports.passwordotp = (forgetPassOtp) => {
  return knex("m_accounts")
    .where({ email: forgetPassOtp.email })
    .update({ otp: forgetPassOtp.otp });
};
exports.OTPAuthenticate = (email, OTP) => {
  return knex
    .from("m_accounts")
    .select("email", "otp")
    .where("email", email)
    .where({ otp: OTP });
};
exports.otpNull = () => {
  return knex.from("m_accounts").update({ otp: null });
};
exports.getFirstLogin = (mobileNo, dialCode) => {
  return knex
    .from("m_accounts")
    .select("mobile_no", "first_login")
    .where("mobile_no", mobileNo)
    .andWhere("mobile_no_dial_code", dialCode);
};
exports.ChangeFirst = (accountId) => {
  return knex
    .from("m_accounts")
    .select("first_login")
    .where("account_id", accountId)
    .update("first_login", "N");
};

exports.OTPResend = (resendData) => {
  return knex
    .from("m_accounts")
    .select("forget_password_otp")
    .where("mobile_no", resendData.mobileNumber);
};
exports.skipPassword = (campanyid) => {
  return knex
    .from("m_accounts")
    .select("email", "forget_password_key", "first_login")
    .where("company_id", campanyid)
    .update("first_login", "N");
};

exports.getAccountSecurityQuestions = (mobileNo, dialCode) => {
  try {
    return knex
      .select("c.security_question_id as questionId", "c.question as question")
      .from("m_accounts AS a")
      .innerJoin(
        "m_account_security_questions as b",
        "a.account_id",
        "=",
        "b.account_id"
      )
      .innerJoin(
        "m_security_questions as c",
        "c.security_question_id",
        "=",
        "b.security_question_id"
      )
      .where("a.mobile_no", mobileNo)
      .andWhere("a.mobile_no_dial_code", dialCode)
      .andWhere("c.active", "Y")
      .orderBy("c.sequence", "asc");
  } catch (error) {
    console.log("getAccountSecurityQuestions failed" + error);
    throw Error(error);
  }
};

exports.getSecurityQuestions = () => {
  try {
    return knex
      .select(
        "security_question_id as securityQuestionId",
        "question as question"
      )
      .from(securityQuestionsModel.table)
      .where(securityQuestionsModel.columns[3].field, "Y")
      .orderBy("sequence", "asc");
  } catch (error) {
    console.log("getSecurityQuestions failed" + error);
    throw Error(error);
  }
};

exports.checkAccountSecurityQuestion = (accountId, reqBody) => {
  try {
    return knex
      .select(...accountSecurityQuestionsModel.selectOneFields(knex))
      .from(accountSecurityQuestionsModel.table)
      .where(accountSecurityQuestionsModel.columns[0].field, accountId)
      .andWhere(
        accountSecurityQuestionsModel.columns[1].field,
        reqBody.securityQuestion.securityQuestionId
      )
      .andWhere(
        accountSecurityQuestionsModel.columns[2].field,
        reqBody.securityQuestion.answer
      );
  } catch (error) {
    console.log("checkAccountSecurityQuestion failed" + error);
    throw Error(error);
  }
};

exports.checkAccount = async (mobileNo, dialCode, roleCodes) => {
  let resultData = [];
  let selectQuery = knex
    .select(
      "a.active as _active",
      "a.signup_flag as _signupFlag",
      "r.code as _roleCodes__code"
    )
    .from("m_accounts as a")
    .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
    .join("m_roles as r", "r.role_id", "=", "ar.role_id")
    .where(function () {
      this.where("a.mobile_no", mobileNo).andWhere(
        "a.mobile_no_dial_code",
        dialCode
      );
    });

  await knexnest(selectQuery).then(function (data) {
    resultData = data;
    if (resultData && resultData.length && resultData[0].roleCodes) {
      resultData[0].roleCodes = data[0].roleCodes.map(function (code) {
        return code["code"];
      });
    }
  });
  if (resultData && resultData[0].roleCodes.some((p) => roleCodes.includes(p)))
    return resultData;
  else return [];
};

exports.getMerchantStoreApprovalStatus = (accountId, roleCodes) => {
  try {
    let roles = ["MR", "MG"];
    if (roles.some((p) => roleCodes.includes(p))) {
      return knex
        .select("b.approval")
        .from("m_merchant_maps as a")
        .innerJoin(
          "m_merchant_stores as b",
          "b.merchant_store_id",
          "=",
          "a.merchant_store_id"
        )
        .where("a.account_id", accountId);
    } else if (roleCodes.includes("ST")) {
      return knex
        .select("b.approval")
        .from("m_professionist_maps as pm")
        .innerJoin(
          "m_merchant_stores as b",
          "b.merchant_store_id",
          "=",
          "pm.merchant_store_id"
        )
        .where("pm.account_id", accountId);
    }
  } catch (error) {
    console.log("getMerchantStoreApprovalStatus failed" + error);
    throw Error(error);
  }
};

exports.getAppVersion = (type) => {
  if (type === "MERCHANT") {
    return knex
      .select("merchant_app_version as version")
      .from(appConfigModel.table);
  } else if (type === "USER") {
    return knex
      .select("customer_app_version as version")
      .from(appConfigModel.table);
  }
};
