const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const professionistGradesModel = require("../models/professionistGrades");
const merchantStoreServiceGradeMapsModel = require("../models/merchantStoreServiceGradeMaps");
const accountsService = require("./accounts");
const registerService = require("./register");
const professionistService = require("./professionist");

exports.getProfessionistGradesCount = async (data = {}, accountId) => {
  let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
  return knex
    .select(
      knex.raw(`COUNT(${professionistGradesModel.columns[0].field}) AS count`)
    )
    .from(professionistGradesModel.table)
    .where(professionistGradesModel.columns[1].field, merchantStoreId)
    .andWhere((qb) => {
      if (data.search !== undefined)
        for (const obj of professionistGradesModel.where) {
          if (data.search[obj.key]) qb.where(obj.field, data.search[obj.key]);
        }
    });
};

exports.getProfessionistGrades = async (data = {}, accountId) => {
  let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
  let resQuery = knex
    .select(
      "professionist_grade_id as professionistGradeId ",
      "name as name",
      "active as active"
    )
    .from(professionistGradesModel.table)
    .where(professionistGradesModel.columns[1].field, merchantStoreId)
    .andWhere((qb) => {
      if (data.search !== undefined)
        for (const obj of professionistGradesModel.where) {
          if (data.search[obj.key]) qb.where(obj.field, data.search[obj.key]);
        }
    });
  if (data.sort === undefined) {
    resQuery = resQuery.orderBy(professionistGradesModel.sort[0].field, "asc");
  } else {
    let [column, order] = data.sort.split(":");
    const found = professionistGradesModel.sort.find((x) => x.key === column);
    if (!found) throw new Error('Invalid "sort" field');
    column = found.field;

    if (order === undefined) order = "asc";

    if (order !== "asc" && order !== "desc")
      throw new Error('Invalid "sort" order');

    resQuery = resQuery.orderBy(column, order);
  }
  if (data.end) resQuery = resQuery.limit(data.end);
  if (data.start) resQuery = resQuery.offset(data.start);
  return resQuery;
};

exports.insertProfessionistGrade = async (reqBody, createdBy, type) => {
  try {
    let merchantStoreId;
    if (type === "ADMIN") {
      merchantStoreId = reqBody.merchantStoreId;
    } else {
      let merchantMaps = await registerService.getMerchantMaps(createdBy);
      if (merchantMaps.length)
        merchantStoreId = merchantMaps[0].merchantStoreId;
    }

    if (merchantStoreId && reqBody.name) {
      console.log(reqBody);
      return knex(professionistGradesModel.table).insert({
        merchant_store_id: merchantStoreId,
        name: reqBody.name,
        active: reqBody.active,
        created_by_type: type,
        created_by: createdBy,
      });
    } else throw new Error("Invalid Store. Insert falied");
  } catch (error) {
    console.log("insertProfessionistGrades failed" + error);
    throw Error(error);
  }
};

exports.updateProfessionistGrade = async (
  professionistGradeId,
  updateData,
  updatedBy,
  type
) => {
  try {
    return knex(professionistGradesModel.table)
      .update(
        Object.assign(professionistGradesModel.checkFields(updateData, false), {
          updated_by: updatedBy,
          active: updateData.active,
          updated_by_type: type,
        })
      )
      .where(professionistGradesModel.columns[0].field, professionistGradeId);
  } catch (error) {
    console.log("updateProfessionistGrade failed" + error);
    throw Error(error);
  }
};

exports.deleteProfessionistGrade = async (professionistGradeId) => {
  try {
    let professionistMaps = await professionistService.getProfessionistMapsByGradeId(
      professionistGradeId
    );
    if (professionistMaps.length) {
      return { assignedFlag: true };
    }
    let serviceMaps = await knex
      .select(merchantStoreServiceGradeMapsModel.columns[0].field)
      .from(merchantStoreServiceGradeMapsModel.table)
      .where(
        merchantStoreServiceGradeMapsModel.columns[1].field,
        professionistGradeId
      );
    if (serviceMaps.length) {
      return { assignedFlag: true };
    }
    {
      await knex(professionistGradesModel.table)
        .where(professionistGradesModel.columns[0].field, professionistGradeId)
        .del();
      return { assignedFlag: false };
    }
  } catch (error) {
    console.log("deleteProfessionistGrade failed" + error);
    throw Error(error);
  }
};
