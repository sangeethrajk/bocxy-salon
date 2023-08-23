const fn = require("./commonFunctions");

const table = "t_appointments";
const columns = [
  { key: "appointmetId", field: "appointment_id" },
  { key: "bookingId", field: "booking_id" },
  { key: "customerAccountId", field: "customer_account_id" },
  { key: "customerName", field: "customer_name" },
  { key: "customerMobile", field: "customer_mobile" },
  { key: "customerMobileCode", field: "customer_mobile_code" },
  { key: "customerMobileCountry", field: "customer_mobile_country" },
  { key: "bookingDate", field: "booking_date" },
  { key: "startTime", field: "start_time", dateTime: true },
  { key: "endTime", field: "end_time", dateTime: true },
  { key: "totalPriceExpected", field: "total_price_expected" },
  { key: "totalPrice", field: "total_price" },
  { key: "discount", field: "discount" },
  { key: "finalPrice", field: "final_price" },
  { key: "rescheduleCount", field: "reschedule_count" },
  { key: "status", field: "status" },
  { key: "active", field: "active" },
  { key: "createdByType", field: "created_by_type" },
  { key: "updatedByType", field: "updated_by_type" },
  { key: "createdAt", field: "created_at", dateTime: true },
  { key: "updatedAt", field: "updated_at", dateTime: true },
  { key: "createdBy", field: "created_by" },
  { key: "updatedBy", field: "updated_by" },
];
const selectAllExclude = [
  "createdBy",
  "updatedBy",
  "createdByType",
  "updatedByType",
];
const selectOneExclude = [];
const selectOneUserExclude = ["createdBy", "updatedBy"];
const whereExclude = [];
const sortExclude = ["createdBy", "updatedBy"];
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
