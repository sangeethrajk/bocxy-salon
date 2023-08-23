const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const professionistMapsModel = require("../models/professionistMaps");
const accountsModel = require("../models/accounts");
const rolesModel = require("../models/roles");
const professionsModel = require("../models/professions");
const merchantMapsModel = require("../models/merchantMaps");
const accountProfilesModel = require("../models/accountProfiles");
const accountRolesModel = require("../models/accountRoles");
const merchantProfessionistSlotsModel = require("../models/merchantProfessionistSlots");
const slotsModel = require("../models/slots");
const appointmentSlotsModel = require("../models/appointmentSlots");
const registerService = require("./register");
const accountsService = require("./accounts");
const knexnest = require("knexnest");
const permissionsService = require("./permissions");
const accountPermissionsModel = require("../models/accountPermissions");
const moment = require("moment");
const merchantService = require("./merchantServices");
const merchantSlotsModel = require("../models/merchantSlots");

const commonService = require("./common");

exports.getAllProfessionist = async (merchantId) => {
  let merchantStoreId = await accountsService.getMerchantStoreId(merchantId);
  if (merchantStoreId) {
    let accounts = await exports.getMerchantProfessionistMapping(merchantId);
    if (accounts.length) {
      let accounIds = accounts.map((p) => p.accountId);
      return knex
        .select(
          // "a.mobile_no as _mobileNo",
          // "a.mobile_no_dial_code as _dialCode",
          "ap.first_name as firstName",
          "a.account_id as accountId",
          "a.active as active"
        )
        .from("m_accounts as a")
        .join("m_account_profiles as ap", "ap.account_id", "=", "a.account_id")
        .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
        .join("m_roles as r", "r.role_id", "=", "ar.role_id")
        .whereIn("a.account_id", accounIds)
        .whereIn("r.code", ["MG", "ST"])
        .distinct();
    }
    return [];
  } else throw new Error("Invalid Store");
};

exports.getStylistList = async (merchantId) => {
  let merchantStoreId = await accountsService.getMerchantStoreId(merchantId);
  if (merchantStoreId) {
    let accounts = await exports.getMerchantProfessionistMapping(merchantId);
    if (accounts.length) {
      let accounIds = accounts.map((p) => p.accountId);
      return knex
        .select(
          // "a.mobile_no as _mobileNo",
          // "a.mobile_no_dial_code as _dialCode",
          "ap.first_name as firstName",
          "a.account_id as accountId"
        )
        .from("m_accounts as a")
        .join("m_account_profiles as ap", "ap.account_id", "=", "a.account_id")
        .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
        .join("m_roles as r", "r.role_id", "=", "ar.role_id")
        .whereIn("a.account_id", accounIds)
        .andWhere("r.code", "ST")
        .andWhere("a.active", "Y")
        .distinct();
    }
    return [];
  } else throw new Error("Invalid Store");
};

exports.getProfessionist = async (accountId) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "a.account_id as _accountId",
        "a.mobile_no as _mobileNo",
        "a.mobile_no_dial_code as _mobileNoDialCode",
        "a.mobile_no_country_code as _mobilNoCountryCode",
        "r.code as _roleCodes__code",
        "ap.first_name as _firstName",
        "ap.email as _email",
        "ap.address AS _address",
        "pm.professionist_grade_id as _professionistGradeId",
        "a.active as _active",
        knex.raw(`DATE_FORMAT(a.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`),
        knex.raw(`DATE_FORMAT(a.updated_at,'%Y-%m-%d %H:%i:%s') as _updatedAt`),
        "a.created_by AS _createdBy",
        "a.updated_by AS _updatedBy"
      )
      .from("m_accounts as a")
      .join("m_account_profiles as ap", "ap.account_id", "=", "a.account_id")
      .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
      .join("m_roles as r", "r.role_id", "=", "ar.role_id")
      .leftJoin(
        "m_professionist_maps as pm",
        "pm.account_id",
        "=",
        "a.account_id"
      )
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
    console.log("getProfessionist failed" + error);
    throw Error(error);
  }
};

exports.getProfessionistUser = async (accountId) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "a.account_id as _accountId",
        "a.mobile_no as _mobileNo",
        "a.mobile_no_dial_code as _mobileNoDialCode",
        "a.mobile_no_country_code as _mobilNoCountryCode",
        "a.active as _active",
        "r.code as _roleCodes__code",
        "ap.first_name as _firstName",
        "ap.email as _email",
        "ap.address as _address",
        "pm.profession_id as _professionId",
        "pm.professionist_grade_id as _professionistGradeId"
      )
      .from("m_accounts as a")
      .join("m_account_profiles as ap", "ap.account_id", "=", "a.account_id")
      .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
      .join("m_roles as r", "r.role_id", "=", "ar.role_id")
      .leftJoin(
        "m_professionist_maps as pm",
        "pm.account_id",
        "=",
        "a.account_id"
      )
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
    console.log("getProfessionistUser failed" + error);
    throw Error(error);
  }
};

exports.getProfessionistByMobileNo = async (mobileNo, dialCode) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "r.code as _roleCodes__code",
        "ap.first_name as _firstName",
        "ap.email as _email",
        "ap.address as _address",
        "pm.profession_id as _professionId"
      )
      .from("m_accounts as a")
      .join("m_account_profiles as ap", "ap.account_id", "=", "a.account_id")
      .join("m_account_roles as ar", "ar.account_id", "=", "a.account_id")
      .join("m_roles as r", "r.role_id", "=", "ar.role_id")
      .leftJoin(
        "m_professionist_maps as pm",
        "pm.account_id",
        "=",
        "a.account_id"
      )
      .where("a.mobile_no", mobileNo)
      .andWhere("a.mobile_no_dial_code", dialCode);

    await knexnest(selectQuery).then(function (data) {
      resultData = data;
      if (resultData.length && resultData[0].roleCodes) {
        resultData[0].roleCodes = data[0].roleCodes.map(function (code) {
          return code["code"];
        });
      }
    });

    return resultData ? resultData : [];
  } catch (error) {
    console.log("getProfessionistByMobileNo failed" + error);
    throw Error(error);
  }
};

exports.insertProfessionist = async (reqBody, createdBy) => {
  try {
    if (reqBody.roleCodes) {
      let roleCodes = reqBody.roleCodes;
      let roleId = [];

      let rolesRow = await exports.getRolesRow();
      if (rolesRow.length) {
        roleCodes.forEach((roleCode) => {
          rolesRow.forEach((role) => {
            if (roleCode === role.code) {
              roleId.push(role.roleId);
            }
          });
        });
      }
      let accountId = await knex(accountsModel.table).insert({
        mobile_no: reqBody.mobileNo,
        mobile_no_dial_code: reqBody.dialCode,
        mobile_no_country_code: reqBody.countryCode,
        signup_flag: 0,
        active: reqBody.active,
        created_by: createdBy,
      });

      roleId.forEach(async (roleId) => {
        await knex(accountRolesModel.table).insert({
          account_id: accountId,
          role_id: roleId,
        });
      });

      let permissions = await permissionsService.getRolePermissions(roleId);
      let insertData = [];
      if (permissions.length) {
        permissions.forEach((permission) => {
          insertData.push({
            account_id: accountId,
            permission_id: permission.permissionId,
          });
        });
        await knex(accountPermissionsModel.table).insert(insertData);
      }

      await knex(accountProfilesModel.table).insert({
        account_id: accountId,
        first_name: reqBody.firstName,
        email: reqBody.email,
        address: reqBody.address,
        created_by: createdBy,
      });

      let merchantMaps = await registerService.getMerchantMaps(createdBy);
      if (merchantMaps.length) {
        merchantStoreId = merchantMaps[0].merchantStoreId;
        if (reqBody.roleCodes.includes("ST")) {
          await knex(professionistMapsModel.table).insert({
            account_id: accountId,
            profession_id: reqBody.professionId, //Salon Specialist
            merchant_store_id: merchantStoreId,
            professionist_grade_id: reqBody.professionistGradeId,
          });
        }
        if (reqBody.roleCodes.includes("MG")) {
          await knex(merchantMapsModel.table).insert({
            account_id: accountId,
            merchant_store_id: merchantStoreId,
          });
        }
      }
      return accountId;
    } else throw new Error("Role is empty");
  } catch (error) {
    console.log("insertProfessionist failed" + error);
    throw Error(error);
  }
};

exports.getRolesRow = () => {
  try {
    return knex
      .select(...rolesModel.selectOneFields(knex))
      .from(rolesModel.table)
      .where(rolesModel.columns[4].field, "Y");
  } catch (error) {
    console.log("getRolesRow failed" + error);
    throw Error(error);
  }
};

exports.updateProfessionist = async (
  professionistId,
  updateData,
  updatedBy
) => {
  return await accountsService.updateAccountProfiles(
    professionistId,
    updateData,
    updatedBy
  );
};

exports.checkMerchantProfessionistMapping = async (
  accountId,
  professionistId
) => {
  try {
    let accounts = await exports.getMerchantProfessionistMapping(accountId);
    if (accounts.length) {
      return accounts.some((list) => list.accountId == professionistId);
    } else throw new Error("Professionist is empty");
  } catch (error) {
    console.log("checkMerchantProfessionistMapping failed" + error);
    throw Error(error);
  }
};

exports.getMerchantProfessionistMapping = async (accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      return knex.select("res.accountId").from(function () {
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
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getMerchantProfessionistMapping failed" + error);
    throw Error(error);
  }
};

exports.getMerchantProfessionistWithSlots = async (
  accountId,
  merchantStoreServiceId,
  userType
) => {
  try {
    let merchantStoreId;
    if (userType === "USER") {
      let merchantData = await merchantService.getMerchantService(
        merchantStoreServiceId
      );
      if (merchantData.length) {
        merchantStoreId = merchantData[0].merchantStoreId;
      }
    } else {
      let merchantMaps = await registerService.getMerchantMaps(accountId);
      if (merchantMaps.length) {
        merchantStoreId = merchantMaps[0].merchantStoreId;
      }
    }
    if (merchantStoreId) {
      return knex
        .distinct("pm.account_id as accountId")
        .from("m_professionist_maps as pm")
        .join(
          "m_merchant_professionist_slots as mps",
          "mps.account_id",
          "=",
          "pm.account_id"
        )
        .where("pm.merchant_store_id", merchantStoreId);
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getMerchantProfessionistWithSlots failed" + error);
    throw Error(error);
  }
};

exports.getAllProfessions = () => {
  return knex
    .select("profession_id as professionId", "profession as name")
    .from(professionsModel.table);
};

exports.getProfessionistMaps = (accountId) => {
  try {
    return knex
      .select(...professionistMapsModel.selectOneFields(knex))
      .from(professionistMapsModel.table)
      .where(professionistMapsModel.columns[0].field, accountId);
  } catch (error) {
    console.log("getProfessionistMaps failed" + error);
    throw Error(error);
  }
};

exports.insertProfessionistSlot = async (accountId, reqBody) => {
  try {
    if (reqBody.timings) {
      await exports.deleteProfessionistWeedaysSlots(
        accountId,
        reqBody.merchantSlotId
      );
      await exports.deleteProfessionistSlots(
        accountId,
        reqBody.merchantSlotId,
        reqBody.slotType
      );
      if (reqBody.weekdayFlag === "Y") {
        let insertData = [];
        reqBody.timings.forEach((timing) => {
          if (timing.availability.length) {
            timing.availability.forEach((data, index) => {
              insertData.push({
                account_id: accountId,
                merchant_slot_id: reqBody.merchantSlotId,
                sequence: index + 1,
                day: timing.day,
                start_time: data.startTime,
                end_time: data.endTime,
              });
            });
          } else {
            insertData.push({
              account_id: accountId,
              merchant_slot_id: reqBody.merchantSlotId,
              sequence: 1,
              day: timing.day,
              start_time: null,
              end_time: null,
            });
          }
        });
        await knex("m_merchant_professionist_slot_weekdays").insert(insertData);
      } else if (reqBody.weekdayFlag === "N") {
        let insertData = [];
        reqBody.timings.forEach((timing, index) => {
          insertData.push({
            account_id: accountId,
            merchant_slot_id: reqBody.merchantSlotId,
            sequence: index + 1,
            slot_type: reqBody.slotType,
            start_time: timing.startTime,
            end_time: timing.endTime,
          });
        });
        await knex(merchantProfessionistSlotsModel.table).insert(insertData);
      } else throw new Error("weekdayFlag is required");
    } else throw new Error("Professionist timings are required");
  } catch (error) {
    console.log("insertProfessionistSlot failed" + error);
    throw Error(error);
  }
};

exports.insertProfessionistSpecialSlot = async (accountId, reqBody) => {
  try {
    if (reqBody.timings) {
      await exports.deleteProfessionistSpecialSlots(
        accountId,
        reqBody.merchantSpecialSlotId,
        reqBody.slotType
      );
      let insertData = [];
      reqBody.timings.forEach((timing, index) => {
        insertData.push({
          account_id: accountId,
          merchant_special_slot_id: reqBody.merchantSpecialSlotId,
          sequence: index + 1,
          slot_type: reqBody.slotType,
          start_time: timing.startTime,
          end_time: timing.endTime,
        });
      });

      await knex(merchantProfessionistSlotsModel.table).insert(insertData);
    } else throw new Error("Professionist timings are required");
  } catch (error) {
    console.log("insertProfessionistSpecialSlot failed" + error);
    throw Error(error);
  }
};

exports.deleteProfessionistWeedaysSlots = (accountId, merchantSlotId) => {
  try {
    return knex("m_merchant_professionist_slot_weekdays")
      .where(merchantProfessionistSlotsModel.columns[0].field, accountId)
      .andWhere(
        merchantProfessionistSlotsModel.columns[2].field,
        merchantSlotId
      )
      .del();
  } catch (error) {
    console.log("deleteProfessionistSlots failed" + error);
    throw Error(error);
  }
};

exports.deleteProfessionistSlots = (accountId, merchantSlotId, slotType) => {
  try {
    return knex(merchantProfessionistSlotsModel.table)
      .where(merchantProfessionistSlotsModel.columns[0].field, accountId)
      .andWhere(
        merchantProfessionistSlotsModel.columns[2].field,
        merchantSlotId
      )
      .andWhere(merchantProfessionistSlotsModel.columns[3].field, slotType)
      .del();
  } catch (error) {
    console.log("deleteProfessionistSlots failed" + error);
    throw Error(error);
  }
};

exports.deleteProfessionistSpecialSlots = (
  accountId,
  merchantSpecialSlotId,
  slotType
) => {
  try {
    return knex(merchantProfessionistSlotsModel.table)
      .where(merchantProfessionistSlotsModel.columns[0].field, accountId)
      .andWhere(
        merchantProfessionistSlotsModel.columns[1].field,
        merchantSpecialSlotId
      )
      .andWhere(merchantProfessionistSlotsModel.columns[3].field, slotType)
      .del();
  } catch (error) {
    console.log("deleteProfessionistSpecialSlots failed" + error);
    throw Error(error);
  }
};

exports.getMerchantProfessionistSlots = async (accountId, merchantSlotId) => {
  try {
    let merchantSlot = await knex
      .select("weekday_flag as weekdayFlag")
      .from(merchantSlotsModel.table)
      .where(merchantSlotsModel.columns[0].field, merchantSlotId);
    if (
      merchantSlot &&
      merchantSlot.length &&
      merchantSlot[0].weekdayFlag === "Y"
    ) {
      let resultData = {};
      let selectQuery = await knex
        .select(
          "day as _day",
          "start_time as _availability__startTime",
          "end_time as _availability__endTime"
        )
        .from("m_merchant_professionist_slot_weekdays")
        .where("account_id", accountId)
        .andWhere("merchant_slot_id", merchantSlotId);
      resultData = await commonService.knexnest(selectQuery, "day");

      return resultData ? resultData : {};
    } else {
      let resultData = [];
      let selectQuery = await knex
        .select("start_time as _time__startTime", "end_time as _time__endTime")
        .from(merchantProfessionistSlotsModel.table)
        .where(merchantProfessionistSlotsModel.columns[0].field, accountId)
        .andWhere(
          merchantProfessionistSlotsModel.columns[2].field,
          merchantSlotId
        );
      resultData = await commonService.knexnest(selectQuery);
      return resultData && resultData.length && resultData[0].time
        ? resultData[0].time
        : [];
    }
  } catch (error) {
    console.log("getMerchantProfessionistSlots failed" + error);
    throw Error(error);
  }
};

exports.getMerchantSpecialSlot = async (accountId, merchantSpcialSlotId) => {
  try {
    let resultData = [];
    let selectQuery = await knex
      .select("start_time as _time__startTime", "end_time as _time__endTime")
      .from(merchantProfessionistSlotsModel.table)
      .where(merchantProfessionistSlotsModel.columns[0].field, accountId)
      .andWhere(
        merchantProfessionistSlotsModel.columns[1].field,
        merchantSpcialSlotId
      );
    resultData = await commonService.knexnest(selectQuery);
    return resultData && resultData.length && resultData[0].time
      ? resultData[0].time
      : [];
  } catch (error) {
    console.log("getMerchantSpecialSlot failed" + error);
    throw Error(error);
  }
};

exports.getMerchantProfessionistSlotsForBooking = async (
  accountId,
  merchantSlotId,
  date,
  type
) => {
  try {
    if (type == "SPECIAL") {
      return knex
        .select("mps.start_time as startTime", "mps.end_time as endTime")
        .from(`${merchantProfessionistSlotsModel.table} AS mps`)
        .where(
          `mps.${merchantProfessionistSlotsModel.columns[0].field}`,
          accountId
        )
        .andWhere("merchant_special_slot_id", merchantSlotId)
        .andWhere("slot_type", "SPECIAL");
    } else {
      let slotData = await knex
        .select("ms.weekday_flag as weekdayFlag")
        .from("m_merchant_slots as ms")
        .where(`ms.merchant_slot_id`, merchantSlotId);
      if (slotData.length) {
        if (slotData[0].weekdayFlag == "Y") {
          let day = moment(date).isoWeekday();
          day = day === 7 ? 1 : day + 1;
          return await knex
            .select("start_time as startTime", "end_time as endTime")
            .from("m_merchant_professionist_slot_weekdays")
            .where("merchant_slot_id", merchantSlotId)
            .andWhere("account_id", accountId)
            .andWhere("day", day);
        } else {
          return await knex
            .select("mps.start_time as startTime", "mps.end_time as endTime")
            .from(`${merchantProfessionistSlotsModel.table} AS mps`)
            .where(
              `mps.${merchantProfessionistSlotsModel.columns[0].field}`,
              accountId
            )
            .andWhere(
              `mps.${merchantProfessionistSlotsModel.columns[2].field}`,
              merchantSlotId
            )
            .andWhere("mps.slot_type", "REGULAR");
        }
      } else throw new Error("Slot is empty");
    }
  } catch (error) {
    console.log("getMerchantProfessionistSlots failed" + error);
    throw Error(error);
  }
};

exports.getAllMerchantProfessionistSlots = (
  accountIds,
  merchantSlotId,
  date
) => {
  try {
    let knexQuery = knex
      .distinct("mps.start_time as startTime", "mps.end_time as endTime")
      .from(`${merchantProfessionistSlotsModel.table} AS mps`)
      .whereIn(
        `mps.${merchantProfessionistSlotsModel.columns[0].field}`,
        accountIds
      )
      .andWhere(
        `mps.${merchantProfessionistSlotsModel.columns[2].field}`,
        merchantSlotId
      );
    return knexQuery;
  } catch (error) {
    console.log("getAllMerchantProfessionistSlots failed" + error);
    throw Error(error);
  }
};

exports.getProfessionistAppoinmentSlots = (
  merchantStoreId,
  stylistAccountId,
  date
) => {
  try {
    return knex
      .select(
        "slot_start_time as slotStartTime",
        "slot_end_time as slotEndTime"
      )
      .from(appointmentSlotsModel.table)
      .where("merchant_store_id", merchantStoreId)
      .where("booking_date", date)
      .whereIn("professionist_account_id", stylistAccountId);
  } catch (error) {
    console.log("getProfessionistAppoinmentSlots failed" + error);
    throw Error(error);
  }
};

exports.getProfessionistAppoinmentSlotsWithAccountId = (
  merchantStoreId,
  stylistAccountId,
  date
) => {
  try {
    return knex
      .select(
        "slot_start_time as slotStartTime",
        "slot_end_time as slotEndTime",
        "professionist_account_id as accountId"
      )
      .from(appointmentSlotsModel.table)
      .where("merchant_store_id", merchantStoreId)
      .where("booking_date", date)
      .whereIn("professionist_account_id", stylistAccountId);
  } catch (error) {
    console.log("getProfessionistAppoinmentSlotsWithAccountId failed" + error);
    throw Error(error);
  }
};

exports.updateProfessionistPermissions = async (
  professionistId,
  updateData,
  updatedBy
) => {
  try {
    let insertData = [];
    await knex(accountPermissionsModel.table)
      .where(accountPermissionsModel.columns[0].field, professionistId)
      .del();
    if (updateData.permissions && updateData.permissions.length) {
      updateData.permissions.forEach((permission) => {
        insertData.push({
          account_id: professionistId,
          permission_id: permission,
        });
      });
      return await knex(accountPermissionsModel.table).insert(insertData);
    }
  } catch (error) {
    console.log("updateProfessionistPermissions failed" + error);
    throw Error(error);
  }
};

exports.getProfessionistPermissions = async (professionistId) => {
  try {
    let result = [];
    let response = await knex
      .select("permission_id as permissionId")
      .from(accountPermissionsModel.table)
      .where(accountPermissionsModel.columns[0].field, professionistId);

    response.forEach((element) => {
      result.push(element.permissionId);
    });
    return result;
  } catch (error) {
    console.log("getProfessionistPermissions failed" + error);
    throw Error(error);
  }
};

exports.getProfessionistMapsByGradeId = (professionistGradeId) => {
  try {
    return knex
      .select(...professionistMapsModel.selectOneFields(knex))
      .from(professionistMapsModel.table)
      .where(professionistMapsModel.columns[3].field, professionistGradeId);
  } catch (error) {
    console.log("getProfessionistMapsByGradeId failed" + error);
    throw Error(error);
  }
};
exports.checkMerchantRoleId = (id) => {
  try {
    return knex
      .select("role_id")
      .from("m_account_roles")
      .where("account_id", id);
  } catch (error) {
    console.log("getProfessionistMapsByGradeId failed" + error);
    throw Error(error);
  }
};

exports.AccountForignKey = async (id) => {
  try {
    const query_res_0 = await knex
      .select("merchant_account_id")
      .from("t_merchant_transactions")
      .where("merchant_account_id", id);

    const query_res_1 = await knex
      .select("professionist_account_id")
      .from("t_appointment_slots")
      .where("professionist_account_id", id);

    const query_res_2 = await knex
      .select("account_id")
      .from("t_merchant_notifications")
      .where("account_id", id);

    const query_res_3 = await knex
      .select("professionist_account_id")
      .from("t_appointments_canceled")
      .where("professionist_account_id", id);
    if (
      (query_res_1.length ||
        query_res_1.length ||
        query_res_1.length ||
        query_res_1.length) != 0
    ) {
      console.log(query_res_0, query_res_1, query_res_2, query_res_3);
      return false;
    }

    return true;
  } catch (error) {
    throw error;
  }
};
