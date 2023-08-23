const fn = require("./commonFunctions");

const table = "m_slots";
const columns = [
  { key: "slotId", field: "slot_id" },
  { key: "slotGroupId", field: "slot_group_id" },
  { key: "slotName", field: "slot_name" },
  { key: "minutes", field: "minutes" },
  { key: "timeFormat", field: "time_format" },
  { key: "active", field: "active", dateTime: true },
];
const selectAllExclude = [];
const selectOneExclude = [];
const selectOneUserExclude = [];
const sortExclude = [];
const insertUpdateExclude = [];

const selectAll = fn.exclude(columns, selectAllExclude);
const selectAllFields = (knex) => fn.fieldConvert(selectAll, knex);

const selectOne = fn.exclude(columns, selectOneExclude);
const selectOneFields = (knex) => fn.fieldConvert(selectOne, knex);

const selectOneUser = fn.exclude(columns, selectOneUserExclude);
const selectOneUserFields = (knex) => fn.fieldConvert(selectOneUser, knex);

const sort = fn.exclude(columns, sortExclude);

const checkFields = (data, trash) =>
  fn.checkFields(columns, data, insertUpdateExclude, trash);

exports.table = table;
exports.columns = columns;
exports.selectAllFields = selectAllFields;
exports.selectOneFields = selectOneFields;
exports.selectOneUserFields = selectOneUserFields;
exports.sort = sort;
exports.checkFields = checkFields;
