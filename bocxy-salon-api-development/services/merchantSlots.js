const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const commonService = require("./common");

const merchantSlotsModel = require("../models/merchantSlots");
const accountsService = require("./accounts");
const moment = require("moment");
const appointmentSlotsModel = require("../models/appointmentSlots");
const appointmentsModel = require("../models/appointments");
const merchantStoresModel = require("../models/merchantStores");
const merchantStoreServicesModel = require("../models/merchantStoreServices");

exports.getMerchantSlot = (merchantSlotId) => {
  return knex
    .select(
      "ms.merchant_slot_id as merchantSlotId",
      "ms.name as name",
      knex.raw(`DATE_FORMAT(ms.start_date,'%Y-%m-%d') as startDate`),
      knex.raw(`DATE_FORMAT(ms.end_date,'%Y-%m-%d') as endDate`),
      "ms.opening_time as openingTime",
      "ms.closing_time as closingTime"
    )
    .from(merchantSlotsModel.table + " as ms")
    .where(merchantSlotsModel.columns[0].field, merchantSlotId);
};

exports.getMerchantSlots = async (accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      let resultData = [];
      let selectQuery = await knex
        .select(
          "ms.merchant_slot_id as _merchantSlotId",
          "ms.name as _name",
          "ms.weekday_flag as _weekdayFlag",
          knex.raw(`DATE_FORMAT(ms.start_date,'%Y-%m-%d') as _startDate`),
          knex.raw(`DATE_FORMAT(ms.end_date,'%Y-%m-%d') as _endDate`),
          knex.raw(`DATE_FORMAT(ms.opening_time,'%H:%i:%s') as _openingTime`),
          knex.raw(`DATE_FORMAT(ms.closing_time,'%H:%i:%s') as _closingTime`),
          "msw.day as _weekdays__day",
          knex.raw(
            `DATE_FORMAT(msw.opening_time,'%H:%i:%s') as _weekdays__openingTime`
          ),
          knex.raw(
            `DATE_FORMAT(msw.closing_time,'%H:%i:%s') as _weekdays__closingTime`
          )
        )
        .from("m_merchant_slots as ms")
        .leftJoin(
          "m_merchant_slot_weekdays as msw",
          "msw.merchant_slot_id",
          "=",
          "ms.merchant_slot_id"
        )
        .where("ms.merchant_store_id", merchantStoreId);

      resultData = await commonService.knexnest(selectQuery, "merchantSlotId");
      return resultData ? resultData : [];
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getMerchantSlots failed" + error);
    throw Error(error);
  }
};
exports.getCheckMerchantSlotsName = async (accountId, name) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      console.log("SLOTS + ss", merchantStoreId);
      let resultData = [];
      let selectQuery = knex
        .select("ms.merchant_slot_id as merchantSlotId", "ms.name as name")
        .from("m_merchant_slots as ms")
        .where("ms.merchant_store_id", merchantStoreId)
        .where("ms.name", name);

      resultData = await selectQuery;
      console.log(resultData);
      return resultData ? resultData : [];
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getMerchantSlots failed" + error);
    throw Error(error);
  }
};
exports.getCheckMerchantSplSlotsName = async (accountId, name) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      console.log("SLOTS + ss", merchantStoreId);
      let resultData = [];
      let selectQuery = knex
        .select(
          "ms.merchant_special_slot_id as merchantSlotId",
          "ms.name as name"
          // "ms.weekday_flag as _weekdayFlag",
        )
        .from("m_merchant_special_slots as ms")
        .where("ms.merchant_store_id", merchantStoreId)
        .where("ms.name", name);

      resultData = await selectQuery;
      console.log(resultData);
      return resultData ? resultData : [];
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getMerchantSlots failed" + error);
    throw Error(error);
  }
};
exports.createMerchantSlots = async (merchantData, accountId, userType) => {
  try {
    if (merchantData.startDate) {
      let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
      let exactCurrentSlot = await exports.checkExactCurrentSlot(
        merchantStoreId,
        merchantData.startDate
      );
      if (exactCurrentSlot && exactCurrentSlot.length) {
        await knex(merchantSlotsModel.table)
          .update(
            Object.assign(merchantSlotsModel.checkFields(merchantData, false), {
              merchant_store_id: merchantStoreId,
              created_by: accountId,
              created_by_type: userType,
            })
          )
          .where("merchant_slot_id", exactCurrentSlot[0].merchantSlotId);

        await exports.deleteOne(exactCurrentSlot[0].merchantSlotId);

        let insertData = [];
        if (merchantData.weekdayFlag === "Y") {
          merchantData.weekdays.forEach((weekday) => {
            insertData.push({
              merchant_slot_id: exactCurrentSlot[0].merchantSlotId,
              day: weekday.day,
              opening_time: weekday.openingTime,
              closing_time: weekday.closingTime,
            });
          });
          await knex("m_merchant_slot_weekdays").insert(insertData);
        }
        return { appointmentFlag: false };
      }

      let currentSlot = await exports.checkCurrentSlot(merchantStoreId);

      if (currentSlot && currentSlot.length) {
        let insertSlot = await knex(merchantSlotsModel.table)
          .insert(
            Object.assign(merchantSlotsModel.checkFields(merchantData, false), {
              merchant_store_id: merchantStoreId,
              created_by: accountId,
              created_by_type: userType,
            })
          )
          .where("merchant_store_id", merchantStoreId);

        let endDate = moment(merchantData.startDate)
          .subtract(1, "days")
          .format("YYYY-MM-DD");
        await knex(merchantSlotsModel.table)
          .update({
            end_date: endDate,
            updated_by: accountId,
            updated_by_type: userType,
          })
          .where("merchant_slot_id", currentSlot[0].merchantSlotId);

        let insertData = [];
        if (merchantData.weekdayFlag === "Y") {
          merchantData.weekdays.forEach((weekday) => {
            insertData.push({
              merchant_slot_id: insertSlot[0],
              day: weekday.day,
              opening_time: weekday.openingTime,
              closing_time: weekday.closingTime,
            });
          });
          await knex("m_merchant_slot_weekdays").insert(insertData);
        }
        return { appointmentFlag: false };
      } else {
        let previousSlot = await exports.checkPreviousSlot(merchantStoreId);
        let upcomingSlot = await exports.checkUpComingSlot(merchantStoreId);
        if (previousSlot && previousSlot.length) {
          if (previousSlot[0].startDate === merchantData.startDate) {
            await exports.deleteUpcomingSlot(upcomingSlot[0].merchantSlotId);
            await knex(merchantSlotsModel.table)
              .update(
                Object.assign(
                  merchantSlotsModel.checkFields(merchantData, false),
                  {
                    merchant_store_id: merchantStoreId,
                    end_date: null,
                    created_by: accountId,
                    created_by_type: userType,
                  }
                )
              )
              .where("merchant_slot_id", previousSlot[0].merchantSlotId);

            await exports.deleteOne(previousSlot[0].merchantSlotId);

            let insertData = [];
            if (merchantData.weekdayFlag === "Y") {
              merchantData.weekdays.forEach((weekday) => {
                insertData.push({
                  merchant_slot_id: previousSlot[0].merchantSlotId,
                  day: weekday.day,
                  opening_time: weekday.openingTime,
                  closing_time: weekday.closingTime,
                });
              });
              await knex("m_merchant_slot_weekdays").insert(insertData);
            }
            return { appointmentFlag: false };
          } else {
            if (upcomingSlot && upcomingSlot.length) {
              await knex(merchantSlotsModel.table)
                .update(
                  Object.assign(
                    merchantSlotsModel.checkFields(merchantData, false),
                    {
                      merchant_store_id: merchantStoreId,
                      created_by: accountId,
                      created_by_type: userType,
                    }
                  )
                )
                .where("merchant_slot_id", upcomingSlot[0].merchantSlotId);

              let endDate = moment(merchantData.startDate)
                .subtract(1, "days")
                .format("YYYY-MM-DD");

              await knex(merchantSlotsModel.table)
                .update({
                  end_date: endDate,
                  updated_by: accountId,
                  updated_by_type: userType,
                })
                .where("merchant_slot_id", previousSlot[0].merchantSlotId);

              await exports.deleteOne(upcomingSlot[0].merchantSlotId);

              let insertData = [];
              if (merchantData.weekdayFlag === "Y") {
                merchantData.weekdays.forEach((weekday) => {
                  insertData.push({
                    merchant_slot_id: upcomingSlot[0].merchantSlotId,
                    day: weekday.day,
                    opening_time: weekday.openingTime,
                    closing_time: weekday.closingTime,
                  });
                });
                await knex("m_merchant_slot_weekdays").insert(insertData);
              }
              return { appointmentFlag: false };
            }
          }
        } else return { appointmentFlag: true };
      }
    } else return { appointmentFlag: true };
  } catch (error) {
    console.log("createMerchantSlots failed" + error);
    throw Error(error);
  }
};

exports.getTopOneMerchantSlotsByMerchantStoreId = (merchantStoreId) => {
  try {
    return knex
      .select(...merchantSlotsModel.selectOneFields(knex))
      .from(merchantSlotsModel.table)
      .where(merchantSlotsModel.columns[1].field, merchantStoreId)
      .orderBy(merchantSlotsModel.columns[0].field, "desc")
      .limit(1);
  } catch (error) {
    console.log("getTopOneMerchantSlotsByMerchantStoreId failed" + error);
    throw Error(error);
  }
};

exports.merchantSlotList = async (accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      return knex
        .select(
          "ms.merchant_slot_id as merchantSlotId",
          "ms.name as name",
          knex.raw("DATE_FORMAT(ms.start_date, '%Y-%m-%d') as startDate"),
          knex.raw("DATE_FORMAT(ms.end_date, '%Y-%m-%d') as endDate")
        )
        .from("m_merchant_slots as ms")
        .where("ms.active", "Y")
        .andWhere("ms.merchant_store_id", merchantStoreId);
    } else throw new Error("Store not exists");
  } catch (error) {
    console.log("merchantSlotList failed" + error);
    throw Error(error);
  }
};

exports.getAllmerchantSlots = async (merchantSlotId, appoimentDate) => {
  try {
    let slotData = await knex
      .select(
        "ms.opening_time as openingTime",
        "ms.closing_time as closingTime",
        "ms.weekday_flag as weekdayFlag"
      )
      .from("m_merchant_slots as ms")
      .where("ms.merchant_slot_id", merchantSlotId);
    if (slotData.length) {
      if (slotData[0].weekdayFlag == "Y") {
        let day = Number(moment(appoimentDate).isoWeekday());
        day = day === 7 ? 1 : day + 1;
        return knex
          .select("opening_time as openingTime", "closing_time as closingTime")
          .from("m_merchant_slot_weekdays")
          .where("merchant_slot_id", merchantSlotId)
          .andWhere("day", day);
      } else {
        return [
          {
            openingTime: slotData[0].openingTime,
            closingTime: slotData[0].closingTime,
          },
        ];
      }
    } else throw new Error("Slot is empty");
  } catch (error) {
    console.log("getAllmerchantSlots failed" + error);
    throw Error(error);
  }
};

exports.getMerchantSlotsBySlotId = async (merchantSlotId) => {
  try {
    let resultData = {};
    let selectQuery = await knex
      .select(
        "ms.weekday_flag as _weekdayFlag",
        knex.raw(`DATE_FORMAT(ms.opening_time,'%H:%i:%s') as _openingTime`),
        knex.raw(`DATE_FORMAT(ms.closing_time,'%H:%i:%s') as _closingTime`),
        knex.raw(`DATE_FORMAT(ms.start_date,'%Y-%m-%d') as _startDate`),
        knex.raw(`DATE_FORMAT(ms.end_date,'%Y-%m-%d') as _endDate`),
        knex.raw(`DATE_FORMAT(ms.closing_time,'%H:%i:%s') as _closingTime`),
        "msw.day as _weekdays__day",
        knex.raw(
          `DATE_FORMAT(msw.opening_time,'%H:%i:%s') as _weekdays__openingTime`
        ),
        knex.raw(
          `DATE_FORMAT(msw.closing_time,'%H:%i:%s') as _weekdays__closingTime`
        )
      )
      .from("m_merchant_slots as ms")
      .leftJoin(
        "m_merchant_slot_weekdays as msw",
        "msw.merchant_slot_id",
        "=",
        "ms.merchant_slot_id"
      )
      .where("ms.merchant_slot_id", merchantSlotId);
    resultData = await commonService.knexnest(selectQuery);
    return resultData ? resultData : {};
  } catch (error) {
    console.log("getMerchantSlots failed" + error);
    throw Error(error);
  }
};

exports.checkCurrentSlot = async (merchantStoreId) => {
  try {
    const curDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const curDate = curDateTime.split(" ")[0];
    return await knex
      .select(...merchantSlotsModel.selectAllFields(knex))
      .from("m_merchant_slots  as ms")
      .where("ms.start_date", "<=", curDate)
      .andWhere("ms.end_date", null)
      .andWhere("ms.merchant_store_id", merchantStoreId);
  } catch (error) {
    console.log("checkCurrentSlot failed" + error);
    throw Error(error);
  }
};

exports.checkExactCurrentSlot = async (merchantStoreId, start) => {
  try {
    const curDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const curDate = curDateTime.split(" ")[0];
    return await knex
      .select(...merchantSlotsModel.selectAllFields(knex))
      .from("m_merchant_slots  as ms")
      .where("ms.start_date", start)
      .andWhere("ms.start_date", curDate)
      .andWhere("ms.end_date", null)
      .andWhere("ms.merchant_store_id", merchantStoreId);
  } catch (error) {
    console.log("checkCurrentSlot failed" + error);
    throw Error(error);
  }
};

exports.checkPreviousSlot = async (merchantStoreId) => {
  try {
    const curDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const curDate = curDateTime.split(" ")[0];
    return await knex
      .select(...merchantSlotsModel.selectAllFields(knex))
      .from("m_merchant_slots  as ms")
      .where("ms.start_date", "<=", curDate)
      .andWhere("ms.end_date", ">=", curDate)
      .andWhere("ms.merchant_store_id", merchantStoreId);
  } catch (error) {
    console.log("checkPreviousSlot failed" + error);
    throw Error(error);
  }
};

exports.checkUpComingSlot = async (merchantStoreId) => {
  try {
    const curDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const curDate = curDateTime.split(" ")[0];
    return await knex
      .select(...merchantSlotsModel.selectAllFields(knex))
      .from("m_merchant_slots  as ms")
      .where("ms.start_date", ">", curDate)
      .andWhere("ms.merchant_store_id", merchantStoreId);
  } catch (error) {
    console.log("checkPreviousSlot failed" + error);
    throw Error(error);
  }
};

exports.checkSlotsStartDate = async (startDate, merchantStoreId) => {
  try {
    let appointmentCount = await knex
      .select(knex.raw(`COUNT(${"at.appointment_id"}) AS count`))
      .from(appointmentSlotsModel.table + " as ast")
      .join(
        appointmentsModel.table + " as at",
        "ast.appointment_id",
        "=",
        "at.appointment_id"
      )
      .where("at.booking_date", ">=", startDate)
      .andWhere("ast.merchant_store_id", merchantStoreId);

    let merchantSlotCount = await knex
      .select(knex.raw(`COUNT(${"ms.merchant_slot_id"}) AS count`))
      .from(merchantSlotsModel.table + " as ms")
      .where("ms.start_date", ">", startDate)
      .andWhere("ms.merchant_store_id", merchantStoreId);

    let count = 0;
    if (appointmentCount.length) count = appointmentCount[0].count;
    if (merchantSlotCount.length) count += merchantSlotCount[0].count;
    return count;
  } catch (error) {
    console.log("checkSlotsStartDate failed" + error);
    throw Error(error);
  }
};

exports.getStoreDefaultSlots = async (accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      return knex
        .select(
          "ms.default_slot as defaultSlot",
          "ms.default_slot_duration as defaultSlotDuration"
        )
        .from(merchantStoresModel.table + " as ms")
        .where("ms.merchant_store_id", merchantStoreId);
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("getStoreDefaultSlots failed" + error);
    throw Error(error);
  }
};

exports.createStoreDefaultSlots = async (merchantData, accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      if (merchantData.defaultSlot === "Y") {
        await knex(merchantStoresModel.table)
          .update({
            default_slot: merchantData.defaultSlot,
            default_slot_duration: merchantData.defaultSlotDuration,
          })
          .where("merchant_store_id", merchantStoreId);

        await knex(merchantStoreServicesModel.table)
          .update({
            slot_duration: merchantData.defaultSlotDuration,
          })
          .where("merchant_store_id", merchantStoreId);
        return true;
      } else if (merchantData.defaultSlot === "N") {
        await knex(merchantStoresModel.table)
          .update({
            default_slot: merchantData.defaultSlot,
            default_slot_duration: null,
          })
          .where("merchant_store_id", merchantStoreId);

        await knex(merchantStoreServicesModel.table)
          .update({
            slot_duration: knex.ref("duration"),
          })
          .where("merchant_store_id", merchantStoreId);
        return true;
      } else throw new Error("defaultSlot is empty");
    } else throw new Error("Store is empty");
  } catch (error) {
    console.log("createStoreDefaultSlots failed" + error);
    throw Error(error);
  }
};

exports.deleteOne = (id) => {
  return knex("m_merchant_slot_weekdays")
    .where(merchantSlotsModel.columns[0].field, id)
    .del();
};

exports.deleteUpcomingSlot = async (id) => {
  await knex("m_merchant_slot_weekdays")
    .where(merchantSlotsModel.columns[0].field, id)
    .del();

  await knex("m_merchant_professionist_slot_weekdays")
    .where(merchantSlotsModel.columns[0].field, id)
    .del();
  await knex("m_merchant_professionist_slots")
    .where(merchantSlotsModel.columns[0].field, id)
    .del();

  await knex("m_merchant_slots")
    .where(merchantSlotsModel.columns[0].field, id)
    .del();
  return;
};
