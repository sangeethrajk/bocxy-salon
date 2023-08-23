const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const permissionsModel = require("../models/permissions");
const knexnest = require("knexnest");

exports.getRolePermissions = async (roleIds) => {
  try {
    return knex
      .distinct("permission_id as permissionId")
      .from("m_role_permissions")
      .whereIn("role_id", roleIds);
  } catch (error) {
    console.log("getRolePermissions failed" + error);
    throw Error(error);
  }
};

exports.getPermissions = async () => {
  try {
    return knex
      .select("permission_id as permissionId", "name as name")
      .from(permissionsModel.table)
      .where(permissionsModel.columns[4].field, "Y");
  } catch (error) {
    console.log("getPermissions failed" + error);
    throw Error(error);
  }
};

exports.getAccountPermissions = async (accountId) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .distinct("permission as _permissions__permission")
      .from("m_account_permissions as ap")
      .join("m_permissions as p", "p.permission_id", "=", "ap.permission_id")
      .where("ap.account_id", accountId);

    await knexnest(selectQuery).then(function (data) {
      resultData = data;
      if (resultData && resultData.length && resultData[0].permissions) {
        resultData[0].permissions = data[0].permissions.map(function (
          permission
        ) {
          return permission["permission"];
        });
      }
    });

    return resultData ? resultData : [];
  } catch (error) {
    console.log("getAccountPermissions failed" + error);
    throw Error(error);
  }
};
