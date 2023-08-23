const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const secretKey = require("../data/secretKey");

exports.updatePassword = (accountId, passwordData) => {
  const salt = secretKey.salt;
  return knex("m_accounts")
    .where("account_id", accountId)
    .update({
      password: knex.raw(
        `AES_ENCRYPT('${passwordData}', UNHEX(SHA2('${salt}',512)))`
      ),
    });
};
exports.insertNewPassword = (passwordData, salt) => {
  return knex("m_accounts")
    .where("company_id", passwordData.companyId)
    .update({
      password: knex.raw(
        `AES_ENCRYPT('${passwordData.password}', UNHEX(SHA2('${salt}',512)))`
      ),
      otp: null,
      forget_password_key: 0,
    });
};
