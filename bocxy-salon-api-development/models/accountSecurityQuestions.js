const fn = require("./commonFunctions");

const table = "m_account_security_questions";
const columns = [
    { key: "accountId", field: "account_id" },
    { key: "securityQuestionId", field: "security_question_id" },
    { key: "answer", field: "answer" },
    { key: "sequence", field: "sequence" },
    { key: "errorCount", field: "error_count" }
];

const selectAllExclude = ["sequence", "errorCount"];
const selectOneExclude = [];
const selectOneUserExclude = ["sequence", "errorCount"];
// const whereExclude = ["state_id"];
const sortExclude = ["sequence", "errorCount"];
const insertUpdateExclude = [
    "sequence",
    "errorCount",
];

const selectAll = fn.exclude(columns, selectAllExclude);
const selectAllFields = (knex) => fn.fieldConvert(selectAll, knex);

const selectOne = fn.exclude(columns, selectOneExclude);
const selectOneFields = (knex) => fn.fieldConvert(selectOne, knex);

const selectOneUser = fn.exclude(columns, selectOneUserExclude);
const selectOneUserFields = (knex) => fn.fieldConvert(selectOneUser, knex);

// const where = fn.exclude(columns, whereExclude);
const sort = fn.exclude(columns, sortExclude);

const checkFields = (data, trash) =>
    fn.checkFields(columns, data, insertUpdateExclude, trash);

exports.table = table;
exports.columns = columns;
exports.selectAllFields = selectAllFields;
exports.selectOneFields = selectOneFields;
exports.selectOneUserFields = selectOneUserFields;
// exports.where = where;
exports.sort = sort;
exports.checkFields = checkFields;