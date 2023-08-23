const fn = require("./commonFunctions");

const table = "m_account_profiles";
const columns = [
  { key: "accountId", field: "account_id" },
  { key: "firstName", field: "first_name" },
  { key: "middleName", field: "middle_name" },
  { key: "lastName", field: "last_name" },

  { key: "pictureUrl", field: "picture_url" },
  { key: "whatsappNo", field: "whatsapp_no" },
  { key: "address", field: "address" },

  { key: "postalCode", field: "postal_code" },
  { key: "latitude", field: "latitude" },
  { key: "longitude", field: "longitude" },
  { key: "location", field: "location" },
  { key: "googleAddress", field: "google_address" },
  { key: "active", field: "active" },
  { key: "createdAt", field: "created_at", dateTime: true },
  { key: "updatedAt", field: "updated_at", dateTime: true },
  { key: "createdBy", field: "created_by" },
  { key: "updatedBy", field: "updated_by" },
  { key: "email", field: "email" },
  { key: "pictureType", field: "picture_type" },
  { key: "gender", field: "gender" },
  { key: "country", field: "country" },
  { key: "adminAreaLevel1", field: "admin_area_level_1" },
  { key: "adminAreaLevel2", field: "admin_area_level_2" },
  { key: "locality", field: "locality" },
  { key: "subLocality", field: "sub_locality" },
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
