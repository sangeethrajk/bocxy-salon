const fn = require("./commonFunctions");

const table = "t_merchant_customers";
const columns = [
  { key: "merchantStoreId", field: "merchant_store_id" },
  { key: "customerId", field: "customer_id" },
  { key: "visitCount", field: "visit_count" },
  { key: "lastVisitTime", field: "last_visit_time", dateTime: true }, 
];
const selectAllExclude = [];
const selectOneExclude = [];
const selectOneUserExclude = [];
const whereExclude = [];
const sortExclude = [];
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
