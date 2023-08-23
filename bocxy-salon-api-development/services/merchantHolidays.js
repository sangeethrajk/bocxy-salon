const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const merchantHolidaysModel = require("../models/merchantHolidays");
const accountsService = require("../services/accounts");

exports.getMerchantHolidaysCount = (data = {}, merchantStoreId) =>
  knex
    .select(
      knex.raw(`COUNT(${merchantHolidaysModel.columns[0].field}) AS count`)
    )
    .from(merchantHolidaysModel.table)
    .where(merchantHolidaysModel.columns[1].field, merchantStoreId);

exports.getMerchantHolidaysByName = (data = {}, merchantStoreId) => {
  let knexQuery = knex
    .select("mh.merchant_holiday_id  as merchantHolidayId", "mh.name as name")
    .from(merchantHolidaysModel.table + " as mh")
    .where("mh." + merchantHolidaysModel.columns[1].field, merchantStoreId);
  if (data.sort === undefined) {
    knexQuery = knexQuery.orderBy(merchantHolidaysModel.sort[0].field, "asc");
  } else {
    let [column, order] = data.sort.split(":");
    const found = merchantHolidaysModel.sort.find((x) => x.key === column);
    if (!found) throw new Error('Invalid "sort" field');
    column = found.field;

    if (order === undefined) order = "asc";

    if (order !== "asc" && order !== "desc")
      throw new Error('Invalid "sort" order');

    knexQuery = knexQuery.orderBy(column, order);
  }
  if (data.end) knexQuery = knexQuery.limit(data.end);
  if (data.start) knexQuery = knexQuery.offset(data.start);
  return knexQuery;
};

exports.getSingleMerchantHoliday = (id) =>
  knex
    .select(...merchantHolidaysModel.selectOneFields(knex))
    .from(merchantHolidaysModel.table)
    .where(merchantHolidaysModel.columns[0].field, id);

exports.getSingleMerchantHolidayUser = (id) =>
  knex
    .select(...merchantHolidaysModel.selectOneUserFields(knex))
    .from(merchantHolidaysModel.table)
    .where(merchantHolidaysModel.columns[0].field, id);

exports.createMerchantHolidays = async (data, accountId, userType) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    await knex(merchantHolidaysModel.table).insert(
      Object.assign(merchantHolidaysModel.checkFields(data, false), {
        merchant_store_id: merchantStoreId,
        created_by: accountId,
        created_by_type: userType,
      })
    );
  } catch (error) {
    console.log("createMerchantHolidays failed" + error);
    throw Error(error);
  }
};

exports.updateMerchantHolidays = (id, updateData, updatedBy, updatedByType) => {
  return knex(merchantHolidaysModel.table)
    .update(
      Object.assign(merchantHolidaysModel.checkFields(updateData, false), {
        updated_by: updatedBy,
        updated_by_type: updatedByType,
      })
    )
    .where(merchantHolidaysModel.columns[0].field, id);
};

exports.deleteMerchantHoliday = (id) => {
  return knex(merchantHolidaysModel.table)
    .where(merchantHolidaysModel.columns[0].field, id)
    .del();
};

exports.insertOneTrash = (insertData, deletedBy, deletedByType) => {
  return knex(merchantHolidaysModel.table + "_trash").insert(
    Object.assign(merchantHolidaysModel.checkFields(insertData, true), {
      deleted_by: deletedBy,
      deleted_by_type: deletedByType,
    })
  );
};
