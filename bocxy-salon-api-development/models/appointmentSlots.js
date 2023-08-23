const fn = require("./commonFunctions");

const table = "t_appointment_slots";
const columns = [
  { key: "appointmentId", field: "appointment_id" },
  { key: "merchantStoreId", field: "merchant_store_id" },
  { key: "bookingDate", field: "booking_date", date: true },
  { key: "type", field: "type" },
  { key: "slotStartTime", field: "slot_start_time", time: true },
  { key: "slotEndTime", field: "slot_end_time", time: true },
  { key: "professionistAccountId", field: "professionist_account_id" },
];

const selectAllExclude = [];
const selectOneExclude = [];
const selectOneUserExclude = [];
const sortExclude = [];
const whereExclude = [];
const insertUpdateExclude = [];

const selectAll = fn.exclude(columns, selectAllExclude);
const selectAllFields = (knex) => fn.fieldConvert(selectAll, knex);

const selectOne = fn.exclude(columns, selectOneExclude);
const selectOneFields = (knex) => fn.fieldConvert(selectOne, knex);

const selectOneUser = fn.exclude(columns, selectOneUserExclude);
const selectOneUserFields = (knex) => fn.fieldConvert(selectOneUser, knex);
const where = fn.exclude(columns, whereExclude);
const sort = fn.exclude(columns, sortExclude);

const checkFields = (data, trash) =>
  fn.checkFields(columns, data, insertUpdateExclude, trash);

exports.table = table;
exports.columns = columns;
exports.selectAllFields = selectAllFields;
exports.selectOneFields = selectOneFields;
exports.selectOneUserFields = selectOneUserFields;
exports.where = where;
exports.sort = sort;
exports.checkFields = checkFields;
