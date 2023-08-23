const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const model = require("../models/genderCategories");

exports.getAll = () => {
  return knex
    .select(...model.selectAllFields(knex))
    .from(model.table)
    .where("active", "Y");
};

exports.getAllList = () => {
  return knex
    .select(...model.selectAllListFields(knex))
    .from(model.table)
    .where("active", "Y");
};

exports.getOne = (id) => {
  return knex
    .select(...model.selectOneFields(knex))
    .from(model.table)
    .where(model.columns[0].field, id);
};

exports.getOneOfUser = (id) => {
  return knex
    .select(...model.selectOneFields(knex))
    .from(model.table)
    .where(model.columns[0].field, id);
};

exports.insertOne = (insertData, createdBy) => {
  return knex(model.table).insert(
    Object.assign(model.checkFields(insertData, false), {
      created_by: createdBy,
    })
  );
};

exports.updateOne = (id, updateData, updatedBy) => {
  return knex(model.table)
    .update(
      Object.assign(model.checkFields(updateData, false), {
        updated_by: updatedBy,
      })
    )
    .where(model.columns[0].field, id);
};

exports.insertOneTrash = (insertData, deletedBy) => {
  return knex(model.table + "_trash").insert(
    Object.assign(model.checkFields(insertData, true), {
      deleted_by: deletedBy,
    })
  );
};

exports.deleteOne = (id) => {
  return knex(model.table).where(model.columns[0].field, id).del();
};
