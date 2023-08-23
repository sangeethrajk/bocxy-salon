const fn = require("./commonFunctions");

const table = "m_merchant_professionist_slots";
const columns = [
  { key: "accountId", field: "account_id" },
  { key: "merchantSpecialSlotId", field: "merchant_special_slot_id" },
  { key: "merchantSlotId", field: "merchant_slot_id" },
  { key: "slotType", field: "slot_type" },
  { key: "startTime", field: "start_time" },
  { key: "endTime", field: "end_time" },
  { key: "sequence", field: "sequence" },
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
