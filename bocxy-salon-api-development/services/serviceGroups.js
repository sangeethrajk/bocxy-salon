const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const model = require("../models/serviceGroups");

exports.getAllCount = (data = {}, id) =>
  knex
    .select(knex.raw(`COUNT(${model.columns[0].field}) AS count`))
    .from(model.table);

exports.getAll = () => {
  return knex
    .select(...model.selectAllFields(knex))
    .from(model.table)
    .where("active", "Y")
    .orderBy("sequence", "asc");
    
};

exports.getAllList = () => {
  return knex
  .select(
    "sg.service_group_id as serviceGroupId",
    "sg.name as name",
    "sg.icon as icon"
  )
  .from(model.table + " as sg")
  .where("sg.active", "Y")
  .orderBy("sg.sequence", "asc");
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
