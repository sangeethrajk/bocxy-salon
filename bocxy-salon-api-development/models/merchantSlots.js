const fn = require("./commonFunctions");

const table = "m_merchant_slots";
const columns = [
  { key: "merchantSlotId", field: "merchant_slot_id" },
  { key: "merchantStoreId", field: "merchant_store_id" },
  { key: "name", field: "name" },
  { key: "openingTime", field: "opening_time" },
  { key: "weekdayFlag", field: "weekday_flag" },
  { key: "closingTime", field: "closing_time" },
  { key: "startDate", field: "start_date", date: true },
  { key: "endDate", field: "end_date", date: true },
  { key: "active", field: "active" },
  { key: "createdAt", field: "created_at", dateTime: true },
  { key: "updatedAt", field: "updated_at", dateTime: true },
  { key: "createdBy", field: "created_by" },
  { key: "updatedBy", field: "updated_by" },
  { key: "createdByType", field: "created_by_type" },
  { key: "updatedByType", field: "updated_by_type" },
];

const selectAllExclude = ["createdBy", "updatedBy"];
const selectOneExclude = [];
const selectOneUserExclude = ["createdBy", "updatedBy"];
const sortExclude = [];
const insertUpdateExclude = [
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
];

const selectAll = fn.exclude(columns, selectAllExclude);
const selectAllFields = (knex) => fn.fieldConvert(selectAll, knex);

const selectOne = fn.exclude(columns, selectOneExclude);
const selectOneFields = (knex) => fn.fieldConvert(selectOne, knex);

const selectOneUser = fn.exclude(columns, selectOneUserExclude);
const selectOneUserFields = (knex) => fn.fieldConvert(selectOneUser, knex);

// const where = fn.exclude(columns, whereExclude);
const sort = fn.exclude(columns, sortExclude);

const checkFields = (data, trash) =>
  fn.checkFields(columns, data, insertUpdateExclude, trash);

exports.table = table;
exports.columns = columns;
exports.selectAllFields = selectAllFields;
exports.selectOneFields = selectOneFields;
exports.selectOneUserFields = selectOneUserFields;
// exports.where = where;
exports.sort = sort;
exports.checkFields = checkFields;
