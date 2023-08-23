const fn = require("./commonFunctions");

const table = "m_merchant_stores";
const columns = [
  { key: "merchantStoreId", field: "merchant_store_id" },
  { key: "storeTypeId", field: "store_type_id" },
  { key: "name", field: "name" },
  { key: "email", field: "email" },
  { key: "telephone", field: "telephone" },
  { key: "telephoneDialCode", field: "telephone_dial_code" },
  { key: "telephoneCountryCode", field: "telephone_country_code" },
  { key: "website", field: "website" },
  { key: "address", field: "address" },
  { key: "latitude", field: "latitude" },
  { key: "longitude", field: "longitude" },
  { key: "location", field: "location" },
  { key: "googleAddress", field: "google_address" },
  { key: "placeId", field: "place_id" },
  { key: "logoUrl", field: "logo_url" },
  { key: "openingTime", field: "opening_time" },
  { key: "closingTime", field: "closing_time" },
  { key: "approval", field: "approval" },
  { key: "active", field: "active" },
  { key: "createdAt", field: "created_at", dateTime: true },
  { key: "updatedAt", field: "updated_at", dateTime: true },
  { key: "createdBy", field: "created_by" },
  { key: "updatedBy", field: "updated_by" },
  { key: "country", field: "country" },
  { key: "adminAreaLevel1", field: "admin_area_level_1" },
  { key: "adminAreaLevel2", field: "admin_area_level_2" },
  { key: "locality", field: "locality" },
  { key: "subLocality", field: "sub_locality" },
  { key: "postalCode", field: "postal_code" },
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
