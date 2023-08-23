const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const nestedKnex = require("nested-knex");
const merchantStoreServicesModel = require("../models/merchantStoreServices");
const merchantServiceRequestsModel = require("../models/merchantServiceRequests");
const serviceCetegoriesModel = require("../models/serviceCetegories");
const serviceCetegoryMapsModel = require("../models/serviceCetegoryMaps");
const servicesModel = require("../models/services");
const registerService = require("./register");
const accountsService = require("./accounts");
const merchantHolidaysModel = require("../models/merchantHolidays");
const merchantStoreServiceGradeMapsModel = require("../models/merchantStoreServiceGradeMaps");
const knexnest = require("knexnest");
const serviceGenderCategoryMapsModel = require("../models/serviceGenderCategoryMaps");
const merchantStoresModel = require("../models/merchantStores");
const merchantSlotsService = require("./merchantSlots");

exports.getMerchantServiceCount = (data = {}) =>
  knex
    .select(
      knex.raw(`COUNT(${merchantStoreServicesModel.columns[0].field}) AS count`)
    )
    .from(merchantStoreServicesModel.table)
    .andWhere((qb) => {
      if (data.search !== undefined)
        for (const obj of merchantStoreServicesModel.where) {
          if (data.search[obj.key]) qb.where(obj.field, data.search[obj.key]);
        }
    });

exports.getMerchantServices = (data = {}) => {
  let knexQuery = knex
    .select(
      "ms.merchant_store_service_id as merchantStoreServiceId",
      "ms.merchant_store_id as merchantStoreId",
      "ms.service_id as serviceId",
      "ms.service_category_id as serviceCategoryId",
      "sc.name as serviceCategoryName",
      "ms.price as price",
      "ms.offer as offer",
      "ms.offer_price as offerPrice",
      "ms.active as active",
      knex.raw(`DATE_FORMAT(ms.offer_start,'%Y-%m-%d %H:%i:%s') as offerStart`),
      knex.raw(`DATE_FORMAT(ms.offer_end,'%Y-%m-%d %H:%i:%s') as offerEnd`),
      knex.raw(`DATE_FORMAT(ms.created_at,'%Y-%m-%d %H:%i:%s') as createdAt`),
      knex.raw(`DATE_FORMAT(ms.updated_at,'%Y-%m-%d %H:%i:%s') as updatedAt`)
    )
    .from(merchantStoreServicesModel.table + " as ms")
    .leftJoin(
      "m_service_categories as sc",
      "sc.service_category_id",
      "=",
      "ms.service_category_id"
    )
    .andWhere((qb) => {
      if (data.search !== undefined)
        for (const obj of merchantStoreServicesModel.where) {
          if (data.search[obj.key]) qb.where(obj.field, data.search[obj.key]);
        }
    });
  if (data.sort === undefined) {
    knexQuery = knexQuery.orderBy(
      merchantStoreServicesModel.sort[0].field,
      "asc"
    );
  } else {
    let [column, order] = data.sort.split(":");
    const found = merchantStoreServicesModel.sort.find((x) => x.key === column);
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

exports.getSingleMerchantService = async (id) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "ms.merchant_store_service_id as _merchantStoreServiceId",
        "ms.merchant_store_id as _merchantStoreId",
        "ms.service_id as _serviceId",
        "ms.service_category_id as _serviceCategoryId",
        "sc.name as _serviceCategoryName",
        "ms.price as _price",
        "ms.duration as _duration",
        "ms.offer as _offer",
        "ms.offer_price as _offerPrice",
        "ms.created_by_type as _createdByType",
        "ms.updated_by_type as _updatedByType",
        "ms.created_by as _createdBy",
        "ms.updated_by as _updatedBy",
        "s.service_group_id as serviceGroupId",
        knex.raw(
          `DATE_FORMAT(ms.offer_start,'%Y-%m-%d %H:%i:%s') as _offerStart`
        ),
        knex.raw(`DATE_FORMAT(ms.offer_end,'%Y-%m-%d %H:%i:%s') as _offerEnd`),
        knex.raw(
          `DATE_FORMAT(ms.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
        ),
        knex.raw(
          `DATE_FORMAT(ms.updated_at,'%Y-%m-%d %H:%i:%s') as _updatedAt`
        ),
        "mssgm.professionist_grade_id as _professionistGrades__professionistGrade"
      )
      .from(merchantStoreServicesModel.table + " as ms")
      .leftJoin(
        "m_service_categories as sc",
        "sc.service_category_id",
        "=",
        "ms.service_category_id"
      )
      .leftJoin(
        "m_merchant_store_service_grade_maps as mssgm",
        "mssgm.merchant_store_service_id",
        "=",
        "ms.merchant_store_service_id"
      )
      .leftJoin("m_services as s", "s.service_id", "=", "ms.service_id")
      .where("ms." + merchantStoreServicesModel.columns[0].field, id);

    await knexnest(selectQuery).then(function (data) {
      resultData = data;
      if (
        resultData &&
        resultData.length &&
        resultData[0].professionistGrades
      ) {
        resultData[0].professionistGrades = data[0].professionistGrades.map(
          function (professionistGrade) {
            return professionistGrade["professionistGrade"];
          }
        );
      }
    });
    return resultData ? resultData : [];
  } catch (error) {
    console.log("getSingleMerchantService failed" + error);
    throw Error(error);
  }
};

exports.getSingleMerchantServiceUser = async (id) => {
  try {
    let resultData = [];
    let selectQuery = knex
      .select(
        "ms.merchant_store_service_id as _merchantStoreServiceId",
        "ms.merchant_store_id as _merchantStoreId",
        "ms.service_id as _serviceId",
        "ms.service_category_id as _serviceCategoryId",
        "ms.duration as _duration",
        "sc.name as _serviceCategoryName",
        "ms.price as _price",
        "ms.offer as _offer",
        "ms.offer_price as _offerPrice",
        "ms.active as _active",
        "s.service_group_id as _serviceGroupId",
        knex.raw(
          `DATE_FORMAT(ms.offer_start,'%Y-%m-%d %H:%i:%s') as _offerStart`
        ),
        knex.raw(`DATE_FORMAT(ms.offer_end,'%Y-%m-%d %H:%i:%s') as _offerEnd`),
        knex.raw(
          `DATE_FORMAT(ms.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
        ),
        knex.raw(
          `DATE_FORMAT(ms.updated_at,'%Y-%m-%d %H:%i:%s') as _updatedAt`
        ),
        "mssgm.professionist_grade_id as _professionistGrades__professionistGrade",
        "sgcm.service_gender_category_id as _serviceGenderCategories__serviceGenderCategory",
        "ms.picture_url as _pictureUrl"
      )
      .from(merchantStoreServicesModel.table + " as ms")
      .leftJoin(
        "m_service_categories as sc",
        "sc.service_category_id",
        "=",
        "ms.service_category_id"
      )
      .leftJoin(
        "m_merchant_store_service_grade_maps as mssgm",
        "mssgm.merchant_store_service_id",
        "=",
        "ms.merchant_store_service_id"
      )
      .leftJoin(
        "m_service_gender_category_maps as sgcm",
        "sgcm.merchant_store_service_id",
        "=",
        "ms.merchant_store_service_id"
      )
      .leftJoin("m_services as s", "s.service_id", "=", "ms.service_id")
      .where("ms." + merchantStoreServicesModel.columns[0].field, id);

    await knexnest(selectQuery).then(function (data) {
      resultData = data;
      if (
        resultData &&
        resultData.length &&
        resultData[0].professionistGrades
      ) {
        resultData[0].professionistGrades = data[0].professionistGrades.map(
          function (professionistGrade) {
            return professionistGrade["professionistGrade"];
          }
        );
      }
      if (
        resultData &&
        resultData.length &&
        resultData[0].serviceGenderCategories
      ) {
        resultData[0].serviceGenderCategories = data[0].serviceGenderCategories.map(
          function (serviceGenderCategory) {
            return serviceGenderCategory["serviceGenderCategory"];
          }
        );
      }
    });
    return resultData ? resultData : [];
  } catch (error) {
    console.log("getSingleMerchantServiceUser failed" + error);
    throw Error(error);
  }
};

exports.insertMerchantService = async (reqBody, createdBy, type) => {
  try {
    let merchantStoreId;
    if (type === "ADMIN") {
      merchantStoreId = reqBody.merchantStoreId;
    } else {
      merchantStoreId = await accountsService.getMerchantStoreId(createdBy);
    }
    let serviceCategory = await exports.getServiceCetegory(
      reqBody.serviceCategory ? reqBody.serviceCategory : ""
    );
    let categoryId;
    if (serviceCategory.length) {
      categoryId = serviceCategory[0].serviceCategoryId;
    } else if (reqBody.serviceCategory) {
      categoryId = await exports.insertServiceCetegory(
        reqBody,
        createdBy,
        type
      );
    }
    let slotDuration;
    let storeDefaultSlot = await merchantSlotsService.getStoreDefaultSlots(
      createdBy
    );
    if (storeDefaultSlot && storeDefaultSlot[0].defaultSlot === "Y") {
      slotDuration = storeDefaultSlot[0].defaultSlotDuration;
    } else {
      slotDuration = reqBody.duration;
    }

    if (merchantStoreId && reqBody.serviceId) {
      if (categoryId)
        await exports.insertServiceCetegoryMaps(reqBody.serviceId, categoryId);
      let merchantStoreServiceId = await knex(
        merchantStoreServicesModel.table
      ).insert(
        Object.assign(merchantStoreServicesModel.checkFields(reqBody, false), {
          merchant_store_id: merchantStoreId,
          service_category_id: categoryId,
          slot_duration: slotDuration,
          created_by: createdBy,
          created_by_type: type,
          updated_by_type: type,
        })
      );
      let insertData = [];
      if (reqBody.professionistGrades && reqBody.professionistGrades.length) {
        reqBody.professionistGrades.forEach((professionistGrade) => {
          insertData.push({
            merchant_store_service_id: merchantStoreServiceId,
            professionist_grade_id: professionistGrade,
          });
        });
        await knex(merchantStoreServiceGradeMapsModel.table).insert(insertData);
      }
      insertData = [];
      if (
        reqBody.serviceGenderCategories &&
        reqBody.serviceGenderCategories.length
      ) {
        reqBody.serviceGenderCategories.forEach((serviceGenderCategory) => {
          insertData.push({
            merchant_store_service_id: merchantStoreServiceId,
            service_gender_category_id: serviceGenderCategory,
          });
        });
        return await knex(serviceGenderCategoryMapsModel.table).insert(
          insertData
        );
      }
    } else throw new Error("Invalid Store or Service. Insert failed");
  } catch (error) {
    console.log("insertMerchantService failed" + error);
    throw Error(error);
  }
};

exports.updateMerchantService = async (
  merchantStoreServiceId,
  reqBody,
  modifiedBy,
  type
) => {
  try {
    let merchantData = await exports.getMerchantService(merchantStoreServiceId);
    if (merchantData.length) {
      let slotDuration;
      let storeDefaultSlot = await merchantSlotsService.getStoreDefaultSlots(
        modifiedBy
      );

      if (storeDefaultSlot && storeDefaultSlot[0].defaultSlot === "Y") {
        slotDuration = storeDefaultSlot[0].defaultSlotDuration;
      } else {
        slotDuration = reqBody.duration;
      }

      if (reqBody.serviceCategory) {
        let serviceCategory = await exports.getServiceCetegory(
          reqBody.serviceCategory
        );
        let categoryId;
        if (serviceCategory.length) {
          categoryId = serviceCategory[0].serviceCategoryId;
        } else {
          categoryId = await exports.insertServiceCetegory(
            reqBody,
            modifiedBy,
            type
          );
        }
        await exports.insertServiceCetegoryMaps(
          merchantData[0].serviceId,
          categoryId
        );
        await knex(merchantStoreServicesModel.table)
          .update(
            Object.assign(
              merchantStoreServicesModel.checkFields(reqBody, false),
              {
                service_category_id: categoryId,
                slot_duration: slotDuration,
                updated_by: modifiedBy,
                updated_by_type: type,
              }
            )
          )
          .where(
            merchantStoreServicesModel.columns[0].field,
            merchantStoreServiceId
          );
      } else {
        await knex(merchantStoreServicesModel.table)
          .update(
            Object.assign(
              merchantStoreServicesModel.checkFields(reqBody, false),
              {
                slot_duration: slotDuration,
                updated_by: modifiedBy,
                updated_by_type: type,
              }
            )
          )
          .where(
            merchantStoreServicesModel.columns[0].field,
            merchantStoreServiceId
          );
      }
      let insertData = [];
      if (reqBody.professionistGrades) {
        await knex(merchantStoreServiceGradeMapsModel.table)
          .where(
            merchantStoreServiceGradeMapsModel.columns[0].field,
            merchantStoreServiceId
          )
          .del();
        reqBody.professionistGrades.forEach((professionistGrade) => {
          insertData.push({
            merchant_store_service_id: merchantStoreServiceId,
            professionist_grade_id: professionistGrade,
          });
        });
        await knex(merchantStoreServiceGradeMapsModel.table).insert(insertData);
      }
      insertData = [];
      if (reqBody.serviceGenderCategories) {
        await knex(serviceGenderCategoryMapsModel.table)
          .where(
            serviceGenderCategoryMapsModel.columns[0].field,
            merchantStoreServiceId
          )
          .del();
        reqBody.serviceGenderCategories.forEach((serviceGenderCategory) => {
          insertData.push({
            merchant_store_service_id: merchantStoreServiceId,
            service_gender_category_id: serviceGenderCategory,
          });
        });
        return await knex(serviceGenderCategoryMapsModel.table).insert(
          insertData
        );
      }
    } else throw new Error("Invalid Store or Service. Update failed");
  } catch (error) {
    console.log("updateMerchantService failed" + error);
    throw Error(error);
  }
};

exports.getMerchantService = (merchantStoreServiceId) => {
  try {
    return knex
      .select(...merchantStoreServicesModel.selectOneFields(knex))
      .from(merchantStoreServicesModel.table)
      .where(
        merchantStoreServicesModel.columns[0].field,
        merchantStoreServiceId
      );
  } catch (error) {
    console.log("getMerchantService failed" + error);
    throw Error(error);
  }
};

exports.getServiceCetegory = (categoryName) => {
  try {
    return knex
      .select(...serviceCetegoriesModel.selectOneFields(knex))
      .from(serviceCetegoriesModel.table)
      .where(knex.raw(`BINARY name`), categoryName);
  } catch (error) {
    console.log("getServiceCetegory failed" + error);
    throw Error(error);
  }
};

exports.getServiceCategories = (id) => {
  return knex
    .select(
      "sc.service_category_id as serviceCategoryId",
      "sc.name as name",
      knex.raw(`DATE_FORMAT(sc.created_at,'%Y-%m-%d %H:%i:%s') as createdAt`)
    )
    .from(serviceCetegoryMapsModel.table + " as scm")
    .join(
      serviceCetegoriesModel.table + " as sc",
      "sc.service_category_id",
      "=",
      "scm.service_category_id"
    )
    .where(serviceCetegoryMapsModel.columns[0].field, id)
    .andWhere(serviceCetegoriesModel.columns[2].field, "Y");
};

exports.insertServiceCetegory = async (reqBody, createdBy, type) => {
  try {
    return knex(serviceCetegoriesModel.table).insert({
      name: reqBody.serviceCategory,
      created_by_type: type,
      created_by: createdBy,
    });
  } catch (error) {
    console.log("insertServiceCetegory failed" + error);
    throw Error(error);
  }
};

exports.insertServiceCetegoryMaps = async (serviceId, serviceCategoryId) => {
  try {
    let categoryMaps = await exports.getServiceCetegoryMaps(
      serviceId,
      serviceCategoryId
    );
    if (!categoryMaps.length) {
      return knex(serviceCetegoryMapsModel.table).insert({
        service_id: serviceId,
        service_category_id: serviceCategoryId,
      });
    }
  } catch (error) {
    console.log("insertServiceCetegoryMaps failed" + error);
    throw Error(error);
  }
};

exports.getServiceCetegoryMaps = async (serviceId, serviceCategoryId) => {
  try {
    return knex
      .select(...serviceCetegoryMapsModel.selectOneFields(knex))
      .from(serviceCetegoryMapsModel.table)
      .where(serviceCetegoryMapsModel.columns[0].field, serviceId)
      .andWhere(serviceCetegoryMapsModel.columns[1].field, serviceCategoryId);
  } catch (error) {
    console.log("getServiceCetegoryMaps failed" + error);
    throw Error(error);
  }
};

exports.insertServiceRequest = async (reqBody, createdBy, type) => {
  try {
    let merchantStoreId;
    if (type === "ADMIN") {
      merchantStoreId = reqBody.merchantStoreId;
    } else {
      let merchantMaps = await registerService.getMerchantMaps(createdBy);
      if (merchantMaps.length)
        merchantStoreId = merchantMaps[0].merchantStoreId;
    }
    if (merchantStoreId && reqBody.serviceName) {
      return knex(merchantServiceRequestsModel.table).insert(
        Object.assign(
          merchantServiceRequestsModel.checkFields(reqBody, false),
          {
            merchant_store_id: merchantStoreId,
            approval: "0",
          }
        )
      );
    } else throw new Error("Invalid Store or Service name. Insert falied");
  } catch (error) {
    console.log("insertServiceRequest failed" + error);
    throw Error(error);
  }
};

exports.insertMerchantServiceTrash = (insertData, deletedBy, type) =>
  knex(merchantStoreServicesModel.table + "_trash").insert(
    Object.assign(merchantStoreServicesModel.checkFields(insertData, true), {
      deleted_by: deletedBy,
      deleted_by_type: type,
    })
  );

exports.deleteMerchantService = async (id) => {
  try {
    const query_res_0 = await knex("m_merchant_store_service_grade_maps")
      .where(merchantStoreServicesModel.columns[0].field, id)
      .del();

    const query_res_2 = await knex("m_service_gender_category_maps")
      .where(merchantStoreServicesModel.columns[0].field, id)
      .del();

    const query_res_1 = await knex(merchantStoreServicesModel.table)
      .where(merchantStoreServicesModel.columns[0].field, id)
      .del();

    return true;
  } catch (error) {
    throw error;
  }
};

exports.getMerchantServiceId = (MerchantStoreServiceId) => {
  return knex
    .select("merchant_store_service_id")
    .from("m_merchant_service_pack_details")
    .where("merchant_store_service_id", MerchantStoreServiceId);
};

exports.getMerchantServicesGroupByService = async (userId, type) => {
  try {
    let resultData = [];
    let merchantStoreId = 0;
    let selectQuery = knex
      .select(
        "ss.service_id as serviceId",
        "ss.name as service",
        "ss.icon as serviceIcon",
        "mss.merchant_store_service_id as merchantStoreServiceId",
        "mss.service_category_id as serviceCategoryId",
        "sc.name as serviceCategoryName",
        "mss.price as price",
        "mss.active as active",
        "sg.service_group_id as serviceGroupId",
        "sg.name as serviceGroupName",
        "sg.icon as icon"
      )
      .from(servicesModel.table + " as ss")
      .join(
        "m_merchant_store_services as mss",
        "mss.service_id",
        "=",
        "ss.service_id"
      )
      .join(
        "m_service_groups as sg",
        "sg.service_group_id",
        "=",
        "ss.service_group_id"
      )
      .join(
        "m_service_categories as sc",
        "sc.service_category_id",
        "=",
        "mss.service_category_id"
      );

    if (type === "MERCHANT") {
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
      selectQuery.where("mss.merchant_store_id", merchantStoreId);
    }
    await nestedKnex
      .array(
        nestedKnex.type({
          serviceGroupId: nestedKnex.number("sg.service_group_id", {
            serviceGroupId: true,
          }),
          serviceGroupName: nestedKnex.string("sg.name"),
          icon: nestedKnex.string("sg.icon"),
          services: nestedKnex.array(
            nestedKnex.type({
              serviceId: nestedKnex.number("ss.service_id", {
                serviceId: true,
              }),
              service: nestedKnex.string("ss.name"),
              serviceIcon: nestedKnex.string("ss.icon"),
              categories: nestedKnex.array(
                nestedKnex.type({
                  merchantStoreServiceId: nestedKnex.number(
                    "mss.merchant_store_service_id",
                    { merchantStoreServiceId: true }
                  ),
                  serviceCategoryId: nestedKnex.number(
                    "mss.service_category_id"
                  ),
                  serviceCategoryName: nestedKnex.string("sc.name"),
                  price: nestedKnex.string("mss.price"),
                  active: nestedKnex.string("mss.active"),
                })
              ),
            })
          ),
        })
      )
      .withQuery(selectQuery)
      .then((records) => {
        resultData = records;
      });
    return resultData ? resultData : [];
  } catch (error) {
    console.log("getMerchantServicesGroupByService failed" + error);
    throw Error(error);
  }
};

exports.merchantServiceList = async (accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      return knex
        .select(
          "mss.merchant_store_service_id as merchantStoreServiceId",
          knex.raw("CONCAT(ms.name,' - ',msc.name) as name")
        )
        .from("m_merchant_store_services as mss")
        .join("m_services as ms", "ms.service_id", "=", "mss.service_id")
        .join(
          "m_service_categories as msc",
          "msc.service_category_id",
          "=",
          "mss.service_category_id"
        )
        .where("mss.active", "Y")
        .andWhere("mss.merchant_store_id", merchantStoreId);
    } else throw new Error("Store not exists");
  } catch (error) {
    console.log("merchantServiceList failed" + error);
    throw Error(error);
  }
};

exports.getMerchantHolidays = (merchantStoreId) => {
  return knex
    .select(...merchantHolidaysModel.selectOneFields(knex))
    .from(merchantHolidaysModel.table)
    .where(merchantHolidaysModel.columns[1].field, merchantStoreId);
};

exports.getServiceGenderCategoryMaps = (MerchantStoreServiceId) => {
  return knex
    .select("merchant_store_service_id")
    .from("m_service_gender_category_maps")
    .where("merchant_store_service_id", MerchantStoreServiceId);
};
exports.merchantServicePackDetails = (MerchantStoreServiceId) => {
  return knex
    .select("merchant_store_service_id")
    .from("m_merchant_service_pack_details")
    .where("merchant_store_service_id", MerchantStoreServiceId);
};

exports.appointmentCanceledServices = (MerchantStoreServiceId) => {
  return knex
    .select("merchant_store_service_id")
    .from("t_appointment_canceled_services")
    .where("merchant_store_service_id", MerchantStoreServiceId);
};

exports.appointmentProvidedServices = (MerchantStoreServiceId) => {
  return knex
    .select("merchant_store_service_id")
    .from("t_appointment_provided_services")
    .where("merchant_store_service_id", MerchantStoreServiceId);
};
exports.appointmentBookedServices = (MerchantStoreServiceId) => {
  return knex
    .select("merchant_store_service_id")
    .from("t_appointment_booked_services")
    .where("merchant_store_service_id", MerchantStoreServiceId);
};

exports.getNearbyMerchantStoreServicesCount = async (data = {}, accountId) => {
  let merchantStoreData = [];
  if (data.location) {
    search = data.location;
    latitude1 = search.latitude;
    longitude1 = search.longitude;
    merchantStoreData = await exports.getMerchantStoreDataByLatLng(search);
  } else if (data.search.merchantStoreId) {
    merchantStoreData = [{ merchantStoreId: data.search.merchantStoreId }];

    // } else if (!data.search.merchantStoreId && accountId) {
    //   let accountData = await exports.getCustomerData(accountId);
    //   if (accountData) {
    //     latitude1 = accountData[0].latitude;
    //     longitude1 = accountData[0].longitude;
    //     merchantStoreData = await exports.getMerchantStoreDataByLatLng(
    //       accountData[0]
    //     );
    //   }
  } else {
    // merchantStoreData = await exports.getMerchantStoreData({});
    merchantStoreData = [];
  }
  let knexQuery;
  if (merchantStoreData && merchantStoreData.length) {
    let merchantStoreIds = merchantStoreData.map((p) => p.merchantStoreId);
    if (merchantStoreIds.length) {
      knexQuery = knex
        .select(
          knex.raw(`COUNT(distinct mss.merchant_store_service_id) AS count`)
        )
        .from("m_merchant_store_services as mss")
        .leftJoin(
          merchantStoresModel.table + " as ms",
          "ms.merchant_store_id",
          "=",
          "mss.merchant_store_id"
        )
        .leftJoin("m_services as s", "s.service_id", "=", "mss.service_id")
        .leftJoin(
          "m_service_categories as sc",
          "sc.service_category_id",
          "=",
          "mss.service_category_id"
        )
        .leftJoin(
          "m_service_gender_category_maps as sgcm",
          "mss.merchant_store_service_id",
          "=",
          "sgcm.merchant_store_service_id"
        )
        .whereIn("mss.merchant_store_id", merchantStoreIds);

      if (data.search.serviceId) {
        knexQuery = knexQuery.andWhere("mss.service_id", data.search.serviceId);
      }

      if (data.search.merchantStoreId) {
        knexQuery = knexQuery.andWhere(
          "mss.merchant_store_id",
          data.search.merchantStoreId
        );
      }

      if (data.search.serviceGenderCategoryId) {
        knexQuery = knexQuery.andWhere(
          "sgcm.service_gender_category_id",
          data.search.serviceGenderCategoryId
        );
      }

      if (data.search.merchantStoreServiceId) {
        knexQuery = knexQuery.andWhere(
          "mss.merchant_store_service_id",
          data.search.merchantStoreServiceId
        );
      }

      if (data.search.search) {
        knexQuery = knexQuery.andWhere(
          knex.raw("CONCAT(s.name,' - ',sc.name)"),
          "rlike",
          data.search.search
        );
      }

      return knexQuery;
    }
  } else return knexQuery;
};

exports.getNearbyMerchantStoreServices = async (data = {}, accountId) => {
  try {
    let merchantStoreData = [];
    let search;
    if (data.location) {
      search = data.location;
      latitude1 = search.latitude;
      longitude1 = search.longitude;
      merchantStoreData = await exports.getMerchantStoreDataByLatLng(search);
    } else if (data.search.merchantStoreId) {
      merchantStoreData = [{ merchantStoreId: data.search.merchantStoreId }];

      // } else if (!data.search.merchantStoreId && accountId) {
      //   let accountData = await exports.getCustomerData(accountId);
      //   if (accountData) {
      //     latitude1 = accountData[0].latitude;
      //     longitude1 = accountData[0].longitude;
      //     merchantStoreData = await exports.getMerchantStoreDataByLatLng(
      //       accountData[0]
      //     );
      //   }
    } else {
      // merchantStoreData = await exports.getMerchantStoreData({});
      merchantStoreData = [];
    }
    if (merchantStoreData && merchantStoreData.length) {
      let merchantStoreIds = merchantStoreData.map((p) => p.merchantStoreId);

      if (merchantStoreIds.length) {
        const columnsNearby = [
          "mss.merchant_store_service_id as merchantStoreServiceId",
          knex.raw("CONCAT(s.name,' - ',sc.name) as serviceName"),
          "mss.picture_url as pictureUrl",
          "mss.merchant_store_id as merchantStoreId",
          "ms.name as storeName",
          "ms.location as location",
          "mss.price as price",
          "mss.offer_price as offerPrice",
        ];

        if (data.location) {
          columnsNearby.push(
            knex.raw(
              `round(( 6371 * acos( cos( radians(${search.latitude})) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${search.longitude})) + sin( radians(${search.latitude})) * sin( radians( latitude ) ) ) ),2) as distance`
            )
          );
        }
        let knexQuery = knex
          .select(...columnsNearby)
          .from("m_merchant_store_services as mss")
          .leftJoin(
            merchantStoresModel.table + " as ms",
            "ms.merchant_store_id",
            "=",
            "mss.merchant_store_id"
          )
          .leftJoin("m_services as s", "s.service_id", "=", "mss.service_id")
          .leftJoin(
            "m_service_categories as sc",
            "sc.service_category_id",
            "=",
            "mss.service_category_id"
          )
          .leftJoin(
            "m_service_gender_category_maps as sgcm",
            "mss.merchant_store_service_id",
            "=",
            "sgcm.merchant_store_service_id"
          )
          .whereIn("mss.merchant_store_id", merchantStoreIds)
          .distinct();

        if (data.search.serviceId) {
          knexQuery = knexQuery.andWhere(
            "mss.service_id",
            data.search.serviceId
          );
        }

        if (data.search.merchantStoreId) {
          knexQuery = knexQuery.andWhere(
            "mss.merchant_store_id",
            data.search.merchantStoreId
          );
        }

        if (data.search.serviceGenderCategoryId) {
          knexQuery = knexQuery.andWhere(
            "sgcm.service_gender_category_id",
            data.search.serviceGenderCategoryId
          );
        }

        if (data.search.merchantStoreServiceId) {
          knexQuery = knexQuery.andWhere(
            "mss.merchant_store_service_id",
            data.search.merchantStoreServiceId
          );
        }

        if (data.search.search) {
          knexQuery = knexQuery.andWhere(
            knex.raw("CONCAT(s.name,' - ',sc.name)"),
            "rlike",
            data.search.search
          );
        }

        if (data.search.orderBy === undefined) {
          if (data.location) {
            knexQuery = knexQuery.orderBy("distance", "asc");
          } else {
            knexQuery = knexQuery.orderBy(
              "mss.merchant_store_service_id",
              "asc"
            );
          }
        } else {
          let [column, order] = data.search.orderBy.split(":");

          if (order === undefined) order = "asc";

          if (order !== "asc" && order !== "desc")
            throw new Error('Invalid "sort" order');

          knexQuery = knexQuery.orderBy(column, order);
        }
        if (data.end) knexQuery = knexQuery.limit(data.end);
        if (data.start) knexQuery = knexQuery.offset(data.start);
        return knexQuery;
      }
    }
  } catch (error) {
    console.log("getNearbyMerchantStoreServices failed" + error);
    throw Error(error);
  }
};

exports.getCustomerData = async (accountId) => {
  return knex
    .select(
      "country as country",
      "admin_area_level_1 as adminAreaLevel1",
      "admin_area_level_2 as adminAreaLevel2",
      "locality as locality",
      "latitude as latitude",
      "longitude as longitude"
    )
    .from("m_account_profiles")
    .where("account_id", accountId);
};

exports.getMerchantStoreData = async (search = {}) => {
  return knex
    .select("ms.merchant_store_id as merchantStoreId")
    .from("m_merchant_stores as ms")
    .where((qb) => {
      if (search.country) qb.where("country", search.country);
      if (search.adminAreaLevel1)
        qb.where("admin_area_level_1", search.adminAreaLevel1);
      if (search.adminAreaLevel2)
        qb.where("admin_area_level_2", search.adminAreaLevel2);
      if (search.locality) qb.where("locality", search.locality);
    })
    .andWhere("ms.active", "Y")
    .andWhere("ms.approval", "APPROVED");
};

exports.getMerchantStoreDataByLatLng = async (search = {}) => {
  return knex
    .select(
      "ms.merchant_store_id as merchantStoreId",
      knex.raw(
        `round(( 6371 * acos( cos( radians(${search.latitude})) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${search.longitude})) + sin( radians(${search.latitude})) * sin( radians( latitude ) ) ) ),2) as distance`
      )
    )
    .from("m_merchant_stores as ms")
    .having(knex.raw("distance < 50"))
    .andWhere("ms.active", "Y")
    .andWhere("ms.approval", "APPROVED");
};

exports.getMerchantStoresList = () => {
  return knex
    .select(
      "merchant_store_id as merchantStoreId",
      "name as name",
      "locality as locality"
    )
    .from("m_merchant_stores")
    .where("active", "Y")
    .andWhere("approval", "APPROVED");
};

exports.getMerchantStoreDataByStoreId = (merchantStoreId) => {
  return knex
    .select(...merchantStoresModel.selectOneFields(knex))
    .from(merchantStoresModel.table)
    .where(merchantStoresModel.columns[0].field, merchantStoreId);
};

exports.getGlobalSearch = async (data = {}) => {
  let mStoreData;
  if (data.location || data.search.merchantStoreId) {
    const columns = [
      knex.raw("? as type", ["STORE"]),
      "name as merchantStoreName",
      "merchant_store_id as merchantStoreId",
      "locality as merchantStoreLocation",
      knex.raw("? as merchantStoreServiceName", [null]),
      knex.raw("? as merchantStoreServiceId", [null]),
      knex.raw("? as serviceCategoryName", [null]),
      knex.raw("? as serviceGenderCategoryName", [null]),
    ];
    if (data.location) {
      columns.push(
        knex.raw(
          `round(( 6371 * acos( cos( radians(${data.location.latitude})) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${data.location.longitude})) + sin( radians(${data.location.latitude})) * sin( radians( latitude ) ) ) ),2) as distance`
        )
      );
    }
    let merchantStore = knex
      .select(...columns)
      .from("m_merchant_stores")
      .where(
        knex.raw(
          `name REGEXP '(^|[[:space:]])${data.search.search}([[:space:]]|$)'`
        )
      )
      .andWhere("active", "Y")
      .andWhere("approval", "APPROVED");

    if (data.search.merchantStoreId) {
      merchantStore = merchantStore.where(
        "merchant_store_id",
        data.search.merchantStoreId
      );
    }

    if (data.location) {
      merchantStore = merchantStore.having(knex.raw("distance < 50"));
    }
    if (data.location) {
      merchantStore = merchantStore.orderBy("distance", "asc");
    } else {
      merchantStore = merchantStore.orderBy("created_at", "desc");
    }

    merchantStore = merchantStore.limit(5);

    mStoreData = await merchantStore;
  } else {
    mStoreData = [];
  }

  let mServiceData;
  if (data.location || data.search.merchantStoreId) {
    const columnsSer = [
      knex.raw("? as type", ["SERVICE"]),
      "ms.name as merchantStoreName",
      "ms.merchant_store_id as merchantStoreId",
      "ms.locality as merchantStoreLocation",
      "s.name as merchantStoreServiceName",
      "mss.merchant_store_service_id as merchantStoreServiceId",
      "sc.name as serviceCategoryName",
      "sgc.name as serviceGenderCategoryName",
    ];
    if (data.location) {
      columnsSer.push(
        knex.raw(
          `round(( 6371 * acos( cos( radians(${data.location.latitude})) * cos( radians( ms.latitude ) ) * cos( radians( ms.longitude ) - radians(${data.location.longitude})) + sin( radians(${data.location.latitude})) * sin( radians( ms.latitude ) ) ) ),2) as distance`
        )
      );
    }

    let merchantStoreService = knex
      .select(...columnsSer)
      .from("m_merchant_store_services as mss")
      .leftJoin(
        "m_merchant_stores as ms",
        "ms.merchant_store_id",
        "=",
        "mss.merchant_store_id"
      )
      .leftJoin("m_services as s", "s.service_id", "=", "mss.service_id")
      .leftJoin(
        "m_service_categories as sc",
        "sc.service_category_id",
        "=",
        "mss.service_category_id"
      )
      .leftJoin(
        "m_service_gender_category_maps as sgcm",
        "mss.merchant_store_service_id",
        "=",
        "sgcm.merchant_store_service_id"
      )
      .leftJoin(
        "m_service_gender_categories as sgc",
        "sgc.service_gender_category_id",
        "=",
        "sgcm.service_gender_category_id"
      )
      .where((qb) => {
        qb.where(
          knex.raw("(CONCAT(s.name,' ',sc.name)"),
          "rlike",
          data.search.search
        )
          .orWhere(
            knex.raw("CONCAT(sc.name,' ',s.name)"),
            "rlike",
            data.search.search
          )
          .orWhere("sgc.name", "rlike", data.search.search)
          .orWhere(
            knex.raw(
              `ms.name REGEXP '(^|[[:space:]])${data.search.search}([[:space:]]|$)')`
            )
          );
      });

    if (data.search.merchantStoreId) {
      merchantStoreService = merchantStoreService.andWhere(
        "ms.merchant_store_id",
        data.search.merchantStoreId
      );
    }

    if (data.location) {
      merchantStoreService = merchantStoreService.having(
        knex.raw("distance < 50")
      );
    }

    merchantStoreService = merchantStoreService
      .andWhere("ms.active", "Y")
      .andWhere("ms.approval", "APPROVED");

    if (data.location) {
      merchantStoreService = merchantStoreService.orderBy([
        { column: "distance", order: "asc" },
        { column: "s.sequence", order: "asc" },
        { column: "mss.created_at", order: "desc" },
      ]);
    } else {
      merchantStoreService = merchantStoreService.orderBy([
        { column: "s.sequence", order: "asc" },
        { column: "mss.created_at", order: "desc" },
      ]);
    }

    merchantStoreService = merchantStoreService.limit(10);

    mServiceData = await merchantStoreService;
  } else {
    mServiceData = [];
  }
  return mStoreData.concat(mServiceData);
};

exports.getMerchantStoreServicesByServiceId = (merchantStoreServiceId) => {
  return knex
    .select(
      knex.raw("CONCAT(s.name,' - ',msc.name) as serviceName"),
      "ms.name as storeName",
      knex.raw(
        "CASE WHEN offer = 'Y' THEN offer_price ELSE price END AS price"
      ),
      "ms.location as location",
      "mss.merchant_store_id as merchantStoreId"
    )
    .from(merchantStoreServicesModel.table + " as mss")
    .join(
      "m_merchant_stores as ms",
      "ms.merchant_store_id",
      "=",
      "mss.merchant_store_id"
    )
    .join("m_services as s", "s.service_id", "=", "mss.service_id")
    .join(
      "m_service_categories as msc",
      "msc.service_category_id",
      "=",
      "mss.service_category_id"
    )
    .where(merchantStoreServicesModel.columns[0].field, merchantStoreServiceId);
};
