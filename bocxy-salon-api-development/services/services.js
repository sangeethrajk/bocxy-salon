const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const servicesModel = require("../models/services");

exports.getAllServices = () => {
  return knex
    .select(...servicesModel.selectAllFields(knex))
    .from(servicesModel.table)
    .where(servicesModel.columns[4].field, "Y")
    .orderBy(servicesModel.columns[9].field, "asc");
};

exports.getService = (id) => {
  return knex
    .select(...servicesModel.selectOneFields(knex))
    .from(servicesModel.table)
    .where(servicesModel.columns[0].field, id);
};

exports.getServiceUser = (id) => {
  return knex
    .select(...servicesModel.selectOneUserFields(knex))
    .from(servicesModel.table)
    .where(servicesModel.columns[0].field, id);
};

exports.insertService = (insertData, createdBy) => {
  return knex(servicesModel.table).insert(
    Object.assign(servicesModel.checkFields(insertData, false), {
      created_by: createdBy,
    })
  );
};

exports.updateService = (serviceId, updateData, updatedBy) => {
  return knex(servicesModel.table)
    .update(
      Object.assign(servicesModel.checkFields(updateData, false), {
        updated_by: updatedBy,
      })
    )
    .where(servicesModel.columns[0].field, serviceId);
};

exports.insertServiceTrash = (insertData, deletedBy) => {
  return knex(servicesModel.table + "_trash").insert(
    Object.assign(servicesModel.checkFields(insertData, true), {
      deleted_by: deletedBy,
    })
  );
};

exports.deleteService = (id) => {
  return knex(servicesModel.table)
    .where(servicesModel.columns[0].field, id)
    .del();
};

exports.getServicesList = () => {
  return knex
    .select("s.service_id as serviceId", "s.name as name", "s.icon as icon")
    .from(servicesModel.table + " as s")
    .where(servicesModel.columns[4].field, "Y")
    .orderBy("s.sequence", "asc");
};

exports.getServicesListForServiceGroupId = (serviceGroupId) => {
  return knex
    .select("s.service_id as serviceId", "s.name as name", "s.icon as icon")
    .from(servicesModel.table + " as s")
    .where("s.service_group_id", serviceGroupId)
    .andWhere(servicesModel.columns[4].field, "Y")
    .orderBy("s.sequence", "asc");
};
