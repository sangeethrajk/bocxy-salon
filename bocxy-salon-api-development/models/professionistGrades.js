const fn = require("./commonFunctions");

const table = "m_professionist_grades";
const columns = [
  { key: "professionistGradeId", field: "professionist_grade_id" },
  { key: "merchantStoreId", field: "merchant_store_id" },
  { key: "name", field: "name" },
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
