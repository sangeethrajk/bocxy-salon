const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);

const accountsModel = require("../models/accounts");
const accountProfilesModel = require("../models/accountProfiles");


exports.checkAccount = (userId, tableName) => {
  return knex(tableName).where("user_id", userId);
};


exports.insertSocialMediaAccount = (reqBody, accountId, tableName) => {
  return knex(tableName).insert({
    account_id: accountId,
    auth_status: reqBody.authStatus,
    access_token: reqBody.accessToken,
    expires_in: reqBody.expiresIn,
    user_id: reqBody.userId,
    session_key: reqBody.sessionKey
  });
};

exports.insertAccountProfile = (reqBody, accountId) => {
  return knex(accountProfilesModel.table).insert({
    account_id: accountId,
    gender: reqBody.gender,
    email: reqBody.email,
    first_name: reqBody.fullName,
    picture_type: "PICTURE",
    picture_url: reqBody.pictureUrl
  });
};

exports.updateAccount = (reqBody, accountId) => {
  return knex(accountsModel.table)
    .update({
      signup_method: reqBody.type,
      otp: null,
      otp_timestamp: null,
      signup_flag: 1
    })
    .where("account_id", accountId);
}
