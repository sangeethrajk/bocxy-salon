const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const merchantStoresModel = require("../models/merchantStores");
const merchantMapsModel = require("../models/merchantMaps");
const merchantSlotsModel = require("../models/merchantSlots");
const accountProfilesModel = require("../models/accountProfiles");
const accountsModel = require("../models/accounts");
const secretKey = require("../data/secretKey");
const registerService = require("./register");
const professionistService = require("./professionist");
const moment = require("moment");
const knexnest = require("knexnest");
const accountRolesModel = require("../models/accountRoles");
const professionistMapsModel = require("../models/professionistMaps");
const professionistGradesModel = require("../models/professionistGrades");
const merchantSpecialSlotsModel = require("../models/merchantSpecialSlots");

exports.getAccount = (id) =>
  knex
    .select(
      "account_id as accountId",
      "mobile_no as mobileNo",
      "mobile_no_dial_code as mobileNoDialCode",
      "active as active",
      "created_at AS createdAt",
      "updated_at AS updatedAt",
      "created_by AS createdBy",
      "updated_by AS updatedBy"
    )
    .from("m_accounts")
    .where("account_id", id)
    .andWhere("active", "Y");

exports.getAccountForTrash = (accountId) => {
  return knex
    .select(...accountsModel.selectOneFields(knex))
    .from(accountsModel.table)
    .where(accountsModel.columns[0].field, accountId);
};

exports.insertCompanyAcc = (insertAccountData, salt) => {
  insertAccountData.password = knex.raw("AES_ENCRYPT(?, UNHEX(SHA2(?,512)))", [
    insertAccountData.password,
    salt,
  ]);
  return knex("m_accounts").insert(insertAccountData);
};

exports.updateAccountProfiles = async (accountId, updateData, updatedBy) => {
  let accountRow = await registerService.getAccountRow(
    updateData.mobileNo,
    updateData.dialCode
  );
  if (!accountRow.length && updateData.mobileNo && updateData.dialCode) {
    await knex(accountsModel.table)
      .update({
        mobile_no: updateData.mobileNo,
        mobile_no_dial_code: updateData.dialCode,
        mobile_no_country_code: updateData.countryCode,
      })
      .where(accountsModel.columns[0].field, accountId);
  } else if (accountRow.length && accountRow[0].accountId != accountId) {
    throw new Error("Mobile number is already mapped to another account");
  }

  await knex(accountsModel.table)
    .update({
      active: updateData.active,
    })
    .where(accountsModel.columns[0].field, accountId);

  if (updateData.roleCodes) {
    let merchantMaps = await registerService.getMerchantMaps(accountId);
    let professionistMaps = await professionistService.getProfessionistMaps(
      accountId
    );
    let accountRoles = await exports.getAccountRole(accountId);
    if (updateData.roleCodes.includes("ST")) {
      let roleIdRow = await registerService.getRoleId("ST");
      if (!accountRoles[0].roleCodes.includes("ST")) {
        await knex(accountRolesModel.table).insert({
          account_id: accountId,
          role_id: roleIdRow[0].roleId,
        });
      }
      if (
        accountRoles[0].roleCodes.includes("MG") &&
        !updateData.roleCodes.includes("MG")
      ) {
        let roleIdRow = await registerService.getRoleId("MG");
        await knex(accountRolesModel.table)
          .where(accountRolesModel.columns[0].field, accountId)
          .andWhere(accountRolesModel.columns[1].field, roleIdRow[0].roleId)
          .del();
      }
      if (!professionistMaps.length) {
        let merchantStoreId = await exports.getMerchantStoreId(updatedBy);
        await knex(professionistMapsModel.table).insert({
          account_id: accountId,
          profession_id: updateData.professionId,
          merchant_store_id: merchantStoreId,
          professionist_grade_id: updateData.professionistGradeId,
        });
      } else if (updateData.professionId && updateData.professionistGradeId) {
        let merchantStoreId = await exports.getMerchantStoreId(updatedBy);
        await knex(professionistMapsModel.table)
          .update({
            profession_id: updateData.professionId,
            professionist_grade_id: updateData.professionistGradeId,
          })
          .where(professionistMapsModel.columns[0].field, accountId)
          .andWhere(professionistMapsModel.columns[2].field, merchantStoreId);
      }
    } else {
      if (professionistMaps.length) {
        await knex(professionistMapsModel.table)
          .where(professionistMapsModel.columns[0].field, accountId)
          .del();
      }
      if (accountRoles[0].roleCodes.includes("ST")) {
        let roleIdRow = await registerService.getRoleId("ST");
        await knex(accountRolesModel.table)
          .where(accountRolesModel.columns[0].field, accountId)
          .andWhere(accountRolesModel.columns[1].field, roleIdRow[0].roleId)
          .del();
      }
    }
    if (updateData.roleCodes.includes("MG")) {
      let roleIdRow = await registerService.getRoleId("MG");
      if (!accountRoles[0].roleCodes.includes("MG")) {
        await knex(accountRolesModel.table).insert({
          account_id: accountId,
          role_id: roleIdRow[0].roleId,
        });
      }
      if (
        accountRoles[0].roleCodes.includes("ST") &&
        !updateData.roleCodes.includes("ST")
      ) {
        let roleIdRow = await registerService.getRoleId("ST");
        await knex(accountRolesModel.table)
          .where(accountRolesModel.columns[0].field, accountId)
          .andWhere(accountRolesModel.columns[1].field, roleIdRow[0].roleId)
          .del();
      }

      if (!merchantMaps.length) {
        let merchantStoreId = await exports.getMerchantStoreId(updatedBy);
        await knex(merchantMapsModel.table).insert({
          account_id: accountId,
          merchant_store_id: merchantStoreId,
        });
      }
    } else {
      if (merchantMaps.length) {
        await knex(merchantMapsModel.table)
          .where(merchantMapsModel.columns[0].field, accountId)
          .del();
      }
      if (accountRoles[0].roleCodes.includes("MG")) {
        let roleIdRow = await registerService.getRoleId("MG");
        await knex(accountRolesModel.table)
          .where(accountRolesModel.columns[0].field, accountId)
          .andWhere(accountRolesModel.columns[1].field, roleIdRow[0].roleId)
          .del();
      }
    }
  }
  return knex(accountProfilesModel.table)
    .update(
      Object.assign(accountProfilesModel.checkFields(updateData, false), {
        updated_by: updatedBy,
      })
    )
    .where(accountProfilesModel.columns[0].field, accountId);
};

exports.getAccounts = async (search = {}) => {
  // ,knex.raw('CAST(AES_DECRYPT(password, UNHEX(SHA2(?,512))) AS CHAR) as password',[salt])
  let knexQuery = knex
    .select(
      "company_id as companyId",
      "username",
      "email",
      "role_id AS roleId",
      "first_login AS firstLogin",
      "role_id AS roleId",
      "active"
    )
    .from("m_accounts")
    .where((qb) => {
      if (search.role_id) qb.where("role_id", search.role_id);
      if (search.email) qb.where("email", search.email);
      if (search.signupFlag) qb.where("first_login", search.firstLogin);
      if (search.account_id) qb.where("company_id", search.company_id);
    });
  if (search.sort) {
    let column = search.sort.split(":");
    if (column.length > 0) {
      knexQuery = knexQuery.orderBy(column[0], column[1]);
    }
  }
  return knexQuery;
};
exports.getAccountExist = async (email) => {
  let knexQuery = knex
    .select("company_id as companyId")
    .from("m_accounts")
    .where((qb) => {
      qb.where("email", email);
    });

  return knexQuery;
};

exports.insertTrashAccounts = (insertData, deletedBy) => {
  return knex(accountsModel.table + "_trash").insert(
    Object.assign(accountsModel.checkFields(insertData, true), {
      deleted_by: deletedBy,
      created_by: insertData.created_by,
      role_id: insertData.role_id,
    })
  );
};

exports.deleteAccount = async (accountId) => {
  await knex("m_merchant_maps").where("account_id", accountId).del();
  await knex("m_professionist_maps").where("account_id", accountId).del();
  await knex("m_account_profiles").where("account_id", accountId).del();
  await knex("m_merchant_maps").where("account_id", accountId).del();
  await knex("m_account_roles").where("account_id", accountId).del();
  await knex("m_account_security_questions")
    .where("account_id", accountId)
    .del();
  await knex("m_account_permissions").where("account_id", accountId).del();
  return await knex("m_accounts").where("account_id", accountId).del();
};

exports.insertOrUpdateMerchantSlot = async (accountId, reqBody, userType) => {
  try {
    let merchantStoreData = await knex
      .select("merchant_store_id as merchantStoreId")
      .from(merchantMapsModel.table)
      .where(merchantMapsModel.columns[0].field, accountId);
    let merchantStoreId = merchantStoreData[0].merchantStoreId;

    await knex(merchantStoresModel.table)
      .update({
        opening_time: reqBody.openingTime,
        closing_time: reqBody.closingTime,
      })
      .where("merchant_store_id", merchantStoreId);

    if (!reqBody.startDate) {
      reqBody.startDate = new Date();
    }

    let insertSlot = await knex(merchantSlotsModel.table)
      .insert(
        Object.assign(merchantSlotsModel.checkFields(reqBody, false), {
          merchant_store_id: merchantStoreId,
          created_by: accountId,
          created_by_type: userType,
        })
      )
      .where("merchant_store_id", merchantStoreId);

    let insertData = [];
    if (reqBody.weekdayFlag === "Y") {
      reqBody.weekdays.forEach((weekday) => {
        insertData.push({
          merchant_slot_id: insertSlot[0],
          day: weekday.day,
          opening_time: weekday.openingTime,
          closing_time: weekday.closingTime,
        });
      });
      await knex("m_merchant_slot_weekdays").insert(insertData);
    }

    await knex(professionistGradesModel.table).insert({
      merchant_store_id: merchantStoreId,
      name: "Default",
      created_by_type: userType,
      created_by: accountId,
    });
  } catch (error) {
    console.log("insertOrUpdateMerchantSlot failed" + error);
    throw Error(error);
  }
};

exports.deleteMerchantSlots = (merchantStoreId) => {
  try {
    return knex(merchantSlotsModel.table)
      .where(merchantSlotsModel.columns[1].field, merchantStoreId)
      .del();
  } catch (error) {
    console.log("deleteAccountSecurityQuestions failed" + error);
    throw Error(error);
  }
};

exports.profileUpdate = async (reqBody, accountId, type) => {
  try {
    let accountRow = await exports.getAccountRole(accountId);
    if (accountRow.length) {
      await knex(accountProfilesModel.table)
        .update(
          Object.assign(accountProfilesModel.checkFields(reqBody, false), {
            updated_by: accountId,
          })
        )
        .where(accountProfilesModel.columns[0].field, accountId);

      let roleIdRow = await registerService.getRoleId("ST");
      if (
        reqBody.enableStylist === true &&
        !accountRow[0].roleCodes.includes("ST")
      ) {
        if (roleIdRow.length) {
          await knex(accountRolesModel.table).insert({
            account_id: accountId,
            role_id: roleIdRow[0].roleId,
          });
        }
      } else if (reqBody.enableStylist === false) {
        if (accountRow[0].roleCodes.includes("ST")) {
          await knex(accountRolesModel.table)
            .where(accountRolesModel.columns[0].field, accountId)
            .andWhere(accountRolesModel.columns[1].field, roleIdRow[0].roleId)
            .del();
        }
      }

      if (accountRow[0].roleCodes.includes("MR")) {
        let merchantMapsRow = await registerService.getMerchantMaps(accountId);
        if (merchantMapsRow.length) {
          if (reqBody.locality || reqBody.adminAreaLevel2) {
            reqBody.location = reqBody.locality
              ? reqBody.adminAreaLevel2
                ? reqBody.locality + ", " + reqBody.adminAreaLevel2
                : reqBody.locality
              : reqBody.adminAreaLevel2;
          }
          return knex(merchantStoresModel.table)
            .update(
              Object.assign(merchantStoresModel.checkFields(reqBody, false), {
                name: reqBody.storeName,
                updated_by: accountId,
                email: reqBody.storeEmail,
                address: reqBody.storeAddress,
              })
            )
            .where(
              merchantStoresModel.columns[0].field,
              merchantMapsRow[0].merchantStoreId
            );
        }
      }
    } else throw new Error("Account is empty");
  } catch (error) {
    console.log("profileUpdate failed" + error);
    throw Error(error);
  }
};

exports.getAccountRole = async (accountId) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "a.account_id as _accountId",
        "a.mobile_no as _mobileNo",
        "a.mobile_no_dial_code as _mobileNoDialCode",
        "a.active as _active",
        "a.signup_flag as _signupFlag",
        "r.code as _roleCodes__code",
        "a.otp as _otp",
        "a.otp_timestamp as _otpTimestamp"
      )
      .from(accountsModel.table + " as a")
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
    console.log("getAccountRole failed" + error);
    throw Error(error);
  }
};

exports.currentUserAccountDetails = async (accountId) => {
  try {
    let accountRow = await exports.getAccountRole(accountId);
    if (accountRow.length) {
      let resultData = [];
      let selectQuery;
      if (accountRow[0].roleCodes.includes("MR")) {
        selectQuery = knex
          .select(
            "a.mobile_no as _mobileNo",
            "a.mobile_no_dial_code as _dialCode",
            "a.active as _active",
            "r.code as _roleCodes__code",
            "ms.name as _storeName",
            "ms.email as _storeEmail",
            "ap.email as _email",
            "ap.address as _address",
            "ap.first_name as _firstName",
            "ap.last_name as _lastName",
            "ap.country as _country",
            "ap.admin_area_level_1 as _adminAreaLevel1",
            "ap.admin_area_level_2 as _adminAreaLevel2",
            "ap.sub_locality as _subLocality",
            "ap.locality as _locality",
            "ap.location as _location",
            "ap.postal_code as _postalCode",
            "ap.latitude as _latitude",
            "ap.longitude as _longitude",
            "ap.google_address as _googleAddress",
            "ms.telephone as _telephone",
            "ms.telephone_dial_code as _telephoneDialCode",
            "ms.address as _storeAddress",
            "ap.picture_url as _pictureUrl",
            "ap.picture_type as _pictureType",
            "st.type as _storeType"
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
          .join(
            "m_store_types as st",
            "st.store_type_id",
            "=",
            "ms.store_type_id"
          )
          .where("a.account_id", accountId);
      } else {
        selectQuery = knex
          .select(
            "a.mobile_no as _mobileNo",
            "a.mobile_no_dial_code as _dialCode",
            "a.active as _active",
            "r.code as _roleCodes__code",
            "ap.email as _email",
            "ap.first_name as _firstName",
            "ap.last_name as _lastName",
            "ap.address  as _address",
            "ap.picture_url as _pictureUrl",
            "ap.picture_type as _pictureType",
            "ap.country as _country",
            "ap.admin_area_level_1 as _adminAreaLevel1",
            "ap.admin_area_level_2 as _adminAreaLevel2",
            "ap.sub_locality as _subLocality",
            "ap.postal_code as _postalCode",
            "ap.latitude as _latitude",
            "ap.longitude as _longitude",
            "ap.google_address as _googleAddress"
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
          .where("a.account_id", accountId);
      }
      await knexnest(selectQuery).then(function (data) {
        resultData = data;
        if (resultData.length && resultData[0].roleCodes) {
          resultData[0].roleCodes = data[0].roleCodes.map(function (code) {
            return code["code"];
          });
        }
      });

      return resultData ? resultData : [];
    } else throw new Error("Account is empty");
  } catch (error) {
    console.log("currentUserAccountDetails failed" + error);
    throw Error(error);
  }
};

exports.profilePasswordUpdate = async (accountId, reqBody) => {
  try {
    let accountRow = await exports.getAccountRole(accountId);
    if (accountRow.length) {
      if (accountRow[0].otp == reqBody.otp) {
        const salt = secretKey.salt;
        return knex("m_accounts")
          .where("account_id", accountId)
          .update({
            password: knex.raw(
              `AES_ENCRYPT('${reqBody.password}', UNHEX(SHA2('${salt}',512)))`
            ),
            otp: null,
            otp_timestamp: null,
          });
      } else throw new Error("Entered otp is wrong");
    } else throw new Error("Account is empty");
  } catch (error) {
    console.log("profilePasswordUpdate failed" + error);
    throw Error(error);
  }
};

exports.updateProfileOtp = (accountId, otp) => {
  try {
    return knex(accountsModel.table)
      .update({
        otp: otp,
        otp_timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
      .where("account_id", accountId);
  } catch (error) {
    console.log("updateProfileOtp failed" + error);
    throw Error(error);
  }
};

exports.getMerchantStoreId = async (accountId) => {
  try {
    let merchantMaps = await registerService.getMerchantMaps(accountId);
    let merchantStoreId;
    if (merchantMaps.length) {
      merchantStoreId = merchantMaps[0].merchantStoreId;
    } else {
      let professionistMaps = await professionistService.getProfessionistMaps(
        accountId
      );
      if (professionistMaps.length)
        merchantStoreId = professionistMaps[0].merchantStoreId;
    }
    if (merchantStoreId) {
      return merchantStoreId;
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getMerchantStoreId failed" + error);
    throw Error(error);
  }
};

exports.getMerchantSlotsByMerchantStoreId = (merchantStoreId) => {
  try {
    return knex
      .select(...merchantSlotsModel.selectOneFields(knex))
      .from(merchantSlotsModel.table)
      .where(merchantSlotsModel.columns[1].field, merchantStoreId);
  } catch (error) {
    console.log("getMerchantSlotsByMerchantStoreId failed" + error);
    throw Error(error);
  }
};

exports.getMerchantSpecialSlotsByMerchantStoreId = (merchantStoreId) => {
  try {
    return knex
      .select(...merchantSpecialSlotsModel.selectOneFields(knex))
      .from(merchantSpecialSlotsModel.table)
      .where(merchantSpecialSlotsModel.columns[1].field, merchantStoreId);
  } catch (error) {
    console.log("getMerchantSpecialSlotsByMerchantStoreId failed" + error);
    throw Error(error);
  }
};
