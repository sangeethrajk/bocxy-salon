const fn = require("./commonFunctions");

const table = "m_service_categories";
const columns = [
  { key: "serviceCategoryId", field: "service_category_id" },
  { key: "name", field: "name" },
  { key: "active", field: "active" },
  { key: "createdAt", field: "created_at", dateTime: true },
  { key: "createdByType", field: "created_by_type" },
  { key: "createdBy", field: "created_by" },
];
const selectAllExclude = ["createdBy"];
const selectOneExclude = [];
const selectOneUserExclude = ["createdBy"];
const whereExclude = [];
const sortExclude = ["createdBy"];
const insertUpdateExclude = ["createdAt", "createdBy"];

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
