const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const merchantSpecialSlotsModel = require("../models/merchantSpecialSlots");
const accountsService = require("./accounts");
const moment = require("moment");
const merchantSpecialSlotsService = require("./merchantSpecialSlots");
const appointmentSlotsModel = require("../models/appointmentSlots");
const appointmentsModel = require("../models/appointments");

exports.getMerchantSpecialSlot = (merchantSpecialSlotId) => {
  return knex
    .select(
      "mss.merchant_special_slot_id as merchantSpecialSlotId",
      "mss.name as name",
      knex.raw(`DATE_FORMAT(mss.start_date,'%Y-%m-%d') as startDate`),
      knex.raw(`DATE_FORMAT(mss.end_date,'%Y-%m-%d') as endDate`),
      "mss.opening_time as openingTime",
      "mss.closing_time as closingTime"
    )
    .from(merchantSpecialSlotsModel.table + " as mss")
    .where(merchantSpecialSlotsModel.columns[0].field, merchantSpecialSlotId);
};

exports.getMerchantSpecialSlotData = (merchantSpecialSlotId) =>
  knex
    .select(...merchantSpecialSlotsModel.selectOneFields(knex))
    .from(merchantSpecialSlotsModel.table)
    .where(merchantSpecialSlotsModel.columns[0].field, merchantSpecialSlotId);

exports.getMerchantSpecialSlots = async (accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      return knex
        .select(
          "mss.merchant_special_slot_id as merchantSpecialSlotId",
          "mss.name as name",
          knex.raw(`DATE_FORMAT(mss.start_date,'%Y-%m-%d') as startDate`),
          knex.raw(`DATE_FORMAT(mss.end_date,'%Y-%m-%d') as endDate`)
        )
        .from("m_merchant_special_slots as mss")
        .where("mss.merchant_store_id", merchantStoreId);
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getMerchantSpecialSlots failed" + error);
    throw Error(error);
  }
};

exports.getMerchantSpecialSlotsList = async (accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      return knex
        .select(
          "mss.merchant_special_slot_id as merchantSpecialSlotId",
          "mss.name as name",
          knex.raw("DATE_FORMAT(mss.start_date, '%Y-%m-%d') as startDate"),
          knex.raw("DATE_FORMAT(mss.end_date, '%Y-%m-%d') as endDate")
        )
        .from("m_merchant_special_slots as mss")
        .where("mss.merchant_store_id", merchantStoreId);
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getMerchantSpecialSlots failed" + error);
    throw Error(error);
  }
};

exports.createMerchantSpecialSlots = async (data, accountId, userType) => {
  try {
    if (data.startDate && data.endDate) {
      let startDate = moment(data.startDate).format("YYYY-MM-DDTHH:mm:ssZ");
      let endDate = moment(data.endDate).format("YYYY-MM-DDTHH:mm:ssZ");
      let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
      let count = await exports.checkSpecialSlots(
        startDate,
        endDate,
        merchantStoreId
      );
      if (count === 0) {
        await knex(merchantSpecialSlotsModel.table)
          .insert(
            Object.assign(merchantSpecialSlotsModel.checkFields(data, false), {
              merchant_store_id: merchantStoreId,
              created_by: accountId,
              created_by_type: userType,
            })
          )
          .where("merchant_store_id", merchantStoreId);
        return { appointmentFlag: false };
      } else return { appointmentFlag: true };
    } else return { appointmentFlag: true };
  } catch (error) {
    console.log("createMerchantSpecialSlots failed" + error);
    throw Error(error);
  }
};

exports.checkSpecialSlots = async (startDate, endDate, merchantStoreId) => {
  try {
    let merchantSpecialSlotsCount = await knex
      .select(knex.raw(`COUNT(${"mss.merchant_special_slot_id"}) AS count`))
      .from(merchantSpecialSlotsModel.table + " as mss")
      .where("mss.start_date", "<=", endDate)
      .where("mss.end_date", ">=", startDate)
      .andWhere("mss.merchant_store_id", merchantStoreId);
    let count = 0;
    if (merchantSpecialSlotsCount.length)
      count += merchantSpecialSlotsCount[0].count;
    return count;
  } catch (error) {
    console.log("checkSpecialSlots failed" + error);
    throw Error(error);
  }
};

exports.getTopOneMerchantSpecialSlotsByMerchantStoreId = (merchantStoreId) => {
  try {
    return knex
      .select(...merchantSpecialSlotsModel.selectOneFields(knex))
      .from(merchantSpecialSlotsModel.table)
      .where(merchantSpecialSlotsModel.columns[1].field, merchantStoreId)
      .orderBy(merchantSpecialSlotsModel.columns[0].field, "desc")
      .limit(1);
  } catch (error) {
    console.log(
      "getTopOneMerchantSpecialSlotsByMerchantStoreId failed" + error
    );
    throw Error(error);
  }
};

exports.updateMerchantSpecialSlot = (
  id,
  updateData,
  updatedBy,
  updatedByType
) => {
  return knex(merchantSpecialSlotsModel.table)
    .update(
      Object.assign(merchantSpecialSlotsModel.checkFields(updateData, false), {
        updated_by: updatedBy,
        updated_by_type: updatedByType,
      })
    )
    .where(merchantSpecialSlotsModel.columns[0].field, id);
};

exports.deleteMerchantSpecialSlot = (id) => {
  return knex(merchantSpecialSlotsModel.table)
    .where(merchantSpecialSlotsModel.columns[0].field, id)
    .del();
};

exports.insertOneTrash = (insertData, deletedBy, deletedByType) => {
  return knex(merchantSpecialSlotsModel.table + "_trash").insert(
    Object.assign(merchantSpecialSlotsModel.checkFields(insertData, true), {
      deleted_by: deletedBy,
      deleted_by_type: deletedByType,
    })
  );
};

exports.getAllMerchantSpecialSlots = async (merchantSpecialSlotId) => {
  try {
    let storeTime = await exports.getMerchantSpecialSlot(merchantSpecialSlotId);
    if (storeTime.length) {
      return knex
        .select(
          "mss.opening_time as openingTime",
          "mss.closing_time as closingTime"
        )
        .from("m_merchant_special_slots as mss")
        .where("mss.merchant_special_slot_id", merchantSpecialSlotId);
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getAllMerchantSpecialSlots failed" + error);
    throw Error(error);
  }
};

exports.checkSpecialSlotsByDate = async (
  startDate,
  endDate,
  merchantStoreId
) => {
  try {
    let appointmentCount = await knex
      .select(knex.raw(`COUNT(${"at.appointment_id"}) AS count`))
      .from(appointmentSlotsModel.table + " as ast")
      .join(
        appointmentsModel.table + " as at",
        "ast.appointment_id",
        "=",
        "at.appointment_id"
      )
      .where("at.booking_date", ">=", startDate)
      .where("at.booking_date", "<=", endDate)
      .andWhere("ast.merchant_store_id", merchantStoreId);

    let merchantSpecialSlotCount = await merchantSpecialSlotsService.checkSpecialSlots(
      startDate,
      endDate,
      merchantStoreId
    );

    let count = 0;
    if (appointmentCount.length) count = appointmentCount[0].count;
    if (merchantSpecialSlotCount) count += merchantSpecialSlotCount;
    return count;
  } catch (error) {
    console.log("checkSlotsStartDate failed" + error);
    throw Error(error);
  }
};
