const fn = require("./commonFunctions");

const table = "t_appointment_booked_services";
const columns = [
  { key: "appointmentBookedServiceId", field: "appointment_booked_service_id" },
  { key: "appointmentId", field: "appointment_id" },
  { key: "merchantStoreServiceId", field: "merchant_store_service_id" },
  { key: "price", field: "price" },
  { key: "professionistAccountId", field: "professionist_account_id" },
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
