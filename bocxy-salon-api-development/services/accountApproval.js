const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const knexnest = require("knexnest");
const accountProfilesModel = require("../models/accountProfiles");
const accountsModel = require("../models/accounts");
const accountRolesModel = require("../models/accountRoles");
const merchantStoresModel = require("../models/merchantStores");
exports.getAccountRole = async (accountId) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "a.account_id as _accountId",
        "a.mobile_no as _mobileNo",
        "ar.role_id as _roleCodes__code",
        "ap.email as _accountProfileEmail"
      )
      .from(accountsModel.table + " as a")
      .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
      .join("m_account_profiles as ap", "ap.account_id", "=", "a.account_id")
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
    console.log("getAccountRole failed" + error);
    throw Error(error);
  }
};

exports.updateAproval = async (updateData, merchantStoreId) => {
  if (updateData.accountId) {
    await knex(merchantStoresModel.table)
      .update({
        approval: "APPROVED",
      })
      .where(merchantStoresModel.columns[0].field, merchantStoreId);
  } else {
    throw new Error("Something went wrong");
  }
};

exports.getMerchantInfo = (merchantStoreId) => {
  return knex
    .select(
      "merchant_store_id as merchantStoreId",
      "name as name",
      "email as email"
    )
    .from("m_merchant_stores")
    .where("merchant_store_id", merchantStoreId)
    .andWhere("approval", "APPROVED");
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
