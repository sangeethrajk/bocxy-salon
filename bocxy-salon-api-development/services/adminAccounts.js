const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const accountsService = require("./accounts");
const knexnest = require("knexnest");

exports.getAdmin = (id) =>
  knex
    .select(
      "a.admin_id as adminId",
      "a.username as username",
      "a.email as email",
      "a.admin_role_id as adminRoleId",
      "b.name as adminRoleName",
      "a.active as active",
      "a.created_at AS createdAt",
      "a.updated_at AS updatedAt"
    )
    .from("m_admins AS a")
    .innerJoin("m_admin_roles as b", "a.admin_role_id", "=", "b.admin_role_id")
    .where("a.admin_id", id);

exports.getCurrentAdmin = (id) =>
  knex
    .select(
      "a.username as username",
      "a.email as email",
      "b.name as adminRoleName",
      "a.active as active"
    )
    .from("m_admins AS a")
    .innerJoin("m_admin_roles as b", "a.admin_role_id", "=", "b.admin_role_id")
    .where("a.admin_id", id);

exports.getCurrentUser = async (id) => {
  try {
    let accountRow = await accountsService.getAccountRole(id);
    if (accountRow.length) {
      let resultData = [];
      let selectQuery;
      let roles = ["MR", "MG"];
      if (accountRow[0].roleCodes.some((p) => roles.includes(p))) {
        selectQuery = knex
          .select(
            "a.mobile_no as _mobileNo",
            "a.mobile_no_dial_code as _mobileNoDialCode",
            "a.active as _active",
            "r.code as _roleCodes__code",
            "ms.name as _storeName",
            "ms.email as _storeEmail",
            "ap.email as _email",
            "ap.first_name as _firstName",
            "ap.last_name as _lastName",
            "ap.picture_url as _pictureUrl",
            "ap.picture_type as _pictureType",
            "p.permission as _permissions__permission"
          )
          .from("m_accounts as a")
          .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
          .join("m_roles as r", "r.role_id", "=", "ar.role_id")
          .join(
            "m_account_profiles as ap",
            "ap.account_id",
            "=",
            "a.account_id"
          )
          .join("m_merchant_maps as mm", "mm.account_id", "=", "a.account_id")
          .join(
            "m_merchant_stores as ms",
            "ms.merchant_store_id",
            "=",
            "mm.merchant_store_id"
          )
          .leftJoin(
            "m_account_permissions as aps",
            "aps.account_id",
            "=",
            "a.account_id"
          )
          .leftJoin(
            "m_permissions as p",
            "p.permission_id",
            "=",
            "aps.permission_id"
          )
          .where("a.account_id", id);
      } else if (accountRow[0].roleCodes.includes("ST")) {
        selectQuery = knex
          .select(
            "a.mobile_no as _mobileNo",
            "a.mobile_no_dial_code as _mobileNoDialCode",
            "a.active as _active",
            "r.code as _roleCodes__code",
            "ms.name as _storeName",
            "ms.email as _storeEmail",
            "ap.email as _email",
            "ap.first_name as _firstName",
            "ap.last_name as _lastName",
            "ap.picture_url as _pictureUrl",
            "ap.picture_type as _pictureType",
            "p.permission as _permissions__permission"
          )
          .from("m_accounts as a")
          .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
          .join("m_roles as r", "r.role_id", "=", "ar.role_id")
          .leftJoin(
            "m_account_profiles as ap",
            "ap.account_id",
            "=",
            "a.account_id"
          )
          .join(
            "m_professionist_maps as pm",
            "pm.account_id",
            "=",
            "a.account_id"
          )
          .join(
            "m_merchant_stores as ms",
            "ms.merchant_store_id",
            "=",
            "pm.merchant_store_id"
          )
          .leftJoin(
            "m_account_permissions as aps",
            "aps.account_id",
            "=",
            "a.account_id"
          )
          .leftJoin(
            "m_permissions as p",
            "p.permission_id",
            "=",
            "aps.permission_id"
          )
          .where("a.account_id", id);
      } else if (accountRow[0].roleCodes.includes("CS")) {
        selectQuery = knex
          .select(
            "a.mobile_no as _mobileNo",
            "a.mobile_no_dial_code as _mobileNoDialCode",
            "a.active as _active",
            "r.code as _roleCodes__code",
            "ap.email as _email",
            "ap.first_name as _firstName",
            "ap.last_name as _lastName",
            "ap.picture_type as _pictureType",
            "ap.picture_url as _pictureUrl",
            "ap.latitude as _latitude",
            "ap.longitude as _longitude",
            "ap.country as _country",
            "ap.admin_area_level_1 as _adminAreaLevel1",
            "ap.admin_area_level_2 as _adminAreaLevel2",
            "ap.locality as _locality"
          )
          .from("m_accounts as a")
          .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
          .join("m_roles as r", "r.role_id", "=", "ar.role_id")
          .leftJoin(
            "m_account_profiles as ap",
            "ap.account_id",
            "=",
            "a.account_id"
          )
          .where("a.account_id", id);
      }
      await knexnest(selectQuery).then(function (data) {
        resultData = data;
        if (resultData && resultData.length && resultData[0].roleCodes) {
          resultData[0].roleCodes = data[0].roleCodes.map(function (code) {
            return code["code"];
          });
        }
        if (resultData && resultData.length && resultData[0].permissions) {
          resultData[0].permissions = data[0].permissions.map(function (
            permission
          ) {
            return permission["permission"];
          });
        }
        if (
          resultData &&
          resultData.length &&
          accountRow &&
          accountRow.length &&
          accountRow[0].roleCodes.includes("CS")
        ) {
          resultData[0].location = {
            latitude: resultData[0].latitude,
            longitude: resultData[0].longitude,
            country: resultData[0].country,
            adminAreaLevel1: resultData[0].adminAreaLevel1,
            adminAreaLevel2: resultData[0].adminAreaLevel2,
            locality: resultData[0].locality,
          };
        }
      });
      return resultData ? resultData : [];
    } else throw new Error("Account is empty");
  } catch (error) {
    console.log("getCurrentUser failed" + error);
    throw Error(error);
  }
};
