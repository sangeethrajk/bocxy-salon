const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const storeTypesModel = require("../models/storeTypes");

const merchantStoresModel = require("../models/merchantStores");

exports.getAll = () => {
  return knex
    .select(...storeTypesModel.selectAllFields(knex))
    .from(storeTypesModel.table)
    .where("active", "Y");
};

exports.getAllList = () => {
  return knex
    .select(...storeTypesModel.selectAllListFields(knex))
    .from(storeTypesModel.table)
    .where("active", "Y");
};

exports.getOne = (id) => {
  return knex
    .select(...storeTypesModel.selectOneFields(knex))
    .from(storeTypesModel.table)
    .where(storeTypesModel.columns[0].field, id);
};

exports.getOneOfUser = (id) => {
  return knex
    .select(...storeTypesModel.selectOneFields(knex))
    .from(storeTypesModel.table)
    .where(storeTypesModel.columns[0].field, id);
};

exports.insertOne = (insertData, createdBy) => {
  return knex(storeTypesModel.table).insert(
    Object.assign(storeTypesModel.checkFields(insertData, false), {
      created_by: createdBy,
    })
  );
};

exports.updateOne = (id, updateData, updatedBy) => {
  return knex(storeTypesModel.table)
    .update(
      Object.assign(storeTypesModel.checkFields(updateData, false), {
        updated_by: updatedBy,
      })
    )
    .where(storeTypesModel.columns[0].field, id);
};

exports.insertOneTrash = (insertData, deletedBy) => {
  return knex(storeTypesModel.table + "_trash").insert(
    Object.assign(storeTypesModel.checkFields(insertData, true), {
      deleted_by: deletedBy,
    })
  );
};

exports.deleteOne = (id) => {
  return knex(storeTypesModel.table)
    .where(storeTypesModel.columns[0].field, id)
    .del();
};

exports.getStoreTypeIdRef = (table, id) => {
  return knex(table).where("store_type_id", id);
};
