const fn = require("./commonFunctions");

const table = "m_account_permissions";
const columns = [
  { key: "accountId", field: "account_id" },
  { key: "permissionId", field: "permission_id" },
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
