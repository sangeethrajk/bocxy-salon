const fn = require("./commonFunctions");

const table = "m_professions";
const columns = [
    { key: "professionId", field: "profession_id" },
    { key: "profession", field: "profession" },
    { key: "speciality", field: "speciality" },
    { key: "description", field: "description" },
    { key: "active", field: "active" },
    { key: "createdAt", field: "created_at", dateTime: true },
    { key: "updatedAt", field: "updated_at", dateTime: true },
    { key: "createdBy", field: "created_by" },
    { key: "updatedBy", field: "updated_by" },
];
const selectAllExclude = ["createdBy", "updatedBy"];
const selectOneExclude = [];
const selectOneUserExclude = ["createdBy", "updatedBy"];
// const whereExclude = ["state_id"];
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
