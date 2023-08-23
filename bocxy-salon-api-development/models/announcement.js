const fn = require("./commonFunctions");

const table = "t_announcements";
const columns = [
  { key: "announcementId", field: "announcement_id" },
  { key: "merchantStoreId", field: "merchant_store_id" },
  { key: "customerType", field: "customer_type" },
  { key: "title", field: "title" },
  { key: "content", field: "content" },
  { key: "status", field: "status" },
  { key: "createdAt", field: "created_at", dateTime: true },
];
const selectAllExclude = ["", ""];
const selectOneExclude = [];
const selectOneUserExclude = ["", ""];
const whereExclude = [""];
const sortExclude = ["", ""];
const insertUpdateExclude = ["createdAt", "", "", ""];

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
