const fn = require("./commonFunctions");

const table = "t_appointments_canceled";
const columns = [
  { key: "appointmetId", field: "appointment_id" },
  { key: "type", field: "type" },
  { key: "merchantStoreId", field: "merchant_store_id" },
  { key: "customerAccountId", field: "customer_account_id" },
  { key: "customerName", field: "customer_name" },
  { key: "customerMobile", field: "customer_mobile" },
  { key: "customerMobileCode", field: "customer_mobile_code" },
  { key: "customerMobileCountry", field: "customer_mobile_country" },
  { key: "bookingDate", field: "booking_date" },
  { key: "slotStartTime", field: "slot_start_time", time: true },
  { key: "slotEndTime", field: "slot_end_time", time: true },
  { key: "professionistAccountId", field: "professionist_account_id" },
  { key: "totalPriceExpected", field: "total_price_expected" },
  { key: "rescheduleCount", field: "reschedule_count" },
  { key: "createdByType", field: "created_by_type" },
  { key: "updatedByType", field: "updated_by_type" },
  { key: "createdAt", field: "created_at", dateTime: true },
  { key: "updatedAt", field: "updated_at", dateTime: true },
  { key: "createdBy", field: "created_by" },
  { key: "updatedBy", field: "updated_by" },
  { key: "cancelReason", field: "cancel_reason" },
  { key: "canceledAt", field: "canceled_at", dateTime: true },
  { key: "canceledByType", field: "canceled_by_type" },
  { key: "canceledBy", field: "canceled_by" },
  { key: "bookingId", field: "booking_id" },
];
const selectAllExclude = [
  "createdBy",
  "updatedBy",
  "canceledBy",
  "createdByType",
  "updatedByType",
  "canceledByType",
];
const selectOneExclude = [];
const selectOneUserExclude = ["createdBy", "updatedBy", "canceledBy"];
const whereExclude = [];
const sortExclude = ["createdBy", "updatedBy", "canceledBy"];
const insertUpdateExclude = [
  "createdAt",
  "updatedAt",
  "canceledAt",
  "createdBy",
  "updatedBy",
  "canceledBy",
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
