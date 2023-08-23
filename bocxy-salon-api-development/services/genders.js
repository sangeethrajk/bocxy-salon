const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const model = require("../models/genders");

exports.getGenderCount = (data = {}) =>
  knex
    .select(knex.raw(`COUNT(${model.columns[0].field}) AS count`))
    .from(model.table)
    .where((qb) => {
      if (data.search !== undefined)
        for (const obj of model.where) {
          if (data.search[obj.key]) qb.where(obj.field, data.search[obj.key]);
        }
    });

exports.getGenders = (data = {}) => {
  let knexQuery = knex
    .select(...model.selectAllFields(knex))
    .from(model.table)
    .where((qb) => {
      if (data.search !== undefined)
        for (const obj of model.where) {
          if (data.search[obj.key]) qb.where(obj.field, data.search[obj.key]);
        }
    });
  if (data.sort === undefined) {
    knexQuery = knexQuery.orderBy(model.sort[0].field, "asc");
  } else {
    let [column, order] = data.sort.split(":");
    const found = model.sort.find((x) => x.key === column);
    if (!found) throw new Error('Invalid "sort" field');
    column = found.field;

    if (order === undefined) order = "asc";

    if (order !== "asc" && order !== "desc")
      throw new Error('Invalid "sort" order');

    knexQuery = knexQuery.orderBy(column, order);
  }
  if (data.end) knexQuery = knexQuery.limit(data.end);
  if (data.start) knexQuery = knexQuery.offset(data.start);
  return knexQuery;
};

exports.getgender = (id) =>
  knex
    .select(...model.selectOneFields(knex))
    .from(model.table)
    .where(model.columns[0].field, id);

exports.getgenderUser = (id) =>
  knex
    .select(...model.selectOneUserFields(knex))
    .from(model.table)
    .where(model.columns[0].field, id);

exports.insertGender = (insertData, createdBy) =>
  knex(model.table).insert(
    Object.assign(model.checkFields(insertData, false), {
      created_by: createdBy,
    })
  );

exports.updateGender = (updateData, updatedBy, id) =>
  knex(model.table)
    .update(
      Object.assign(model.checkFields(updateData, false), {
        updated_by: updatedBy,
      })
    )
    .where(columns[0].field, id);

exports.insertGenderTrash = (insertData, deletedBy) =>
  knex(model.table + "_trash").insert(
    Object.assign(model.checkFields(insertData, true), {
      deleted_by: deletedBy,
    })
  );

exports.deleteGender = (id) =>
  knex(model.table).where(model.columns[0].field, id).del();
