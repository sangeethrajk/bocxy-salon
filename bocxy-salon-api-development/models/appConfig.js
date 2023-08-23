const fn = require("./commonFunctions");

const table = "app_config";
const columns = [
  { key: "customeAppVersion", field: "customer_app_version" },
  { key: "merchantAppVersion", field: "merchant_app_version" },
  { key: "emergencySuspend", field: "emergency_suspend" },
  { key: "defaultSlotDuration", field: "default_slot_duration" },
  { key: "defaultStoreOpeningTime", field: "default_store_opening_time" },
  { key: "defaultStoreClosingTime", field: "default_store_closing_time" },
];

const selectAllExclude = [];
const selectOneExclude = [];
const selectOneUserExclude = [];
// const whereExclude = ["state_id"];
const sortExclude = [];
const insertUpdateExclude = [];

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
