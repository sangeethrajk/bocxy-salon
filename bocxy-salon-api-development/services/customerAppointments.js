const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const moment = require("moment");
const appointmentsModel = require("../models/appointments");
const appointmentCancelledModel = require("../models/appointmentsCanceled");
const appointmentSlotsModel = require("../models/appointmentSlots");
const commonService = require("./common");

exports.getCustomerAppointmentsCount = async (userId, data = {}) => {
  try {
    let knexQuery = knex
      .select(knex.raw(`COUNT(${"at.appointment_id"}) AS count`))
      .from(appointmentsModel.table + " as at")
      .join(
        "t_appointment_slots as ast",
        "ast.appointment_id",
        "=",
        "at.appointment_id"
      )
      .join(
        "m_merchant_stores as mts",
        "ast.merchant_store_id",
        "=",
        "mts.merchant_store_id"
      )
      .where("at.customer_account_id", userId)
      .andWhere((qb) => {
        if (data.search !== undefined)
          for (const obj of appointmentsModel.where) {
            if (data.search[obj.key])
              qb.where("at." + obj.field, data.search[obj.key]);
          }
      });
    return knexQuery;
  } catch (error) {
    console.log("get CustomerAppointmentsCount failed" + error);
    throw Error(error);
  }
};

exports.getCustomerAppointments = async (userId, data = {}) => {
  try {
    let resultData = [];
    let knexQuery = await knex
      .select(
        "at.appointment_id as _appointmentId",
        knex.raw(
          `DATE_FORMAT(at.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
        ),
        knex.raw(
          `DATE_FORMAT(at.booking_date,'%Y-%m-%d %H:%i:%s') as _bookingDate`
        ),
        knex.raw("CONCAT(ms.name,' - ',msc.name) as _serviceName"),
        "ast.slot_start_time as _slotName",
        "mts.locality as _location",
        "mts.name as _storeName",
        "mcp.first_name as _stylistName",
        "at.total_price_expected as _totalAmount",
        knex.raw("? as _cancelReason", [null]),
        "at.status as _status"
      )
      .from(appointmentsModel.table + " as at")
      .join(
        "t_appointment_slots as ast",
        "ast.appointment_id",
        "=",
        "at.appointment_id"
      )
      .leftJoin(
        knex.raw(
          "(SELECT appointment_id, merchant_store_service_id FROM t_appointment_booked_services WHERE appointment_booked_service_id IN (SELECT min(appointment_booked_service_id) FROM t_appointment_booked_services GROUP BY appointment_id )) as abs"
        ),
        "abs.appointment_id",
        "=",
        "at.appointment_id"
      )
      .leftJoin(
        "m_merchant_store_services as mss",
        "mss.merchant_store_service_id",
        "=",
        "abs.merchant_store_service_id"
      )
      .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
      .leftJoin(
        "m_service_categories as msc",
        "msc.service_category_id",
        "=",
        "mss.service_category_id"
      )
      .join(
        "m_merchant_stores as mts",
        "ast.merchant_store_id",
        "=",
        "mts.merchant_store_id"
      )
      .join(
        "m_account_profiles as mcp",
        "mcp.account_id",
        "=",
        "ast.professionist_account_id"
      )
      .where("at.customer_account_id", userId)
      .andWhere((qb) => {
        if (data.search !== undefined) {
          for (const obj of appointmentsModel.where) {
            if (data.search[obj.key])
              qb.where("at." + obj.field, data.search[obj.key]);
          }
        }
      });
    // if (data.sort === undefined) {
    //   knexQuery = knexQuery.orderBy("at.created_at", "desc");
    // } else {
    //   let [column, order] = data.sort.split(":");
    //   const found = appointmentSlotsModel.sort.find((x) => x.key === column);
    //   if (!found) throw new Error('Invalid "sort" field');
    //   column = found.field;

    //   if (order === undefined) order = "asc";

    //   if (order !== "asc" && order !== "desc")
    //     throw new Error('Invalid "sort" order');

    //   knexQuery = knexQuery.orderBy("at." + column, order);
    // }
    // if (data.end) knexQuery = knexQuery.limit(data.end);
    // if (data.start) knexQuery = knexQuery.offset(data.start);

    resultData = await commonService.knexnest(knexQuery, "appointmentId");

    return resultData ? resultData : [];
  } catch (error) {
    console.log("get CustomerAppointments failed" + error);
    throw Error(error);
  }
};

exports.getCustomerCancelledAppointments = async (userId, data = {}) => {
  try {
    let resultData = [];
    let knexQuery = await knex
      .select(
        "at.appointment_id as _appointmentId",
        knex.raw(
          `DATE_FORMAT(at.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
        ),
        knex.raw(
          `DATE_FORMAT(at.booking_date,'%Y-%m-%d %H:%i:%s') as _bookingDate`
        ),
        knex.raw("CONCAT(ms.name,' - ',msc.name) as _serviceName"),
        "mts.locality as _location",
        "mts.name as _storeName",
        "mcp.first_name as _stylistName",
        "at.total_price_expected as _totalAmount",
        knex.raw("? as _status", ["CANCELED"]),
        "at.cancel_reason as _cancelReason",
        "at.slot_start_time as _slotName"
      )
      .from(appointmentCancelledModel.table + " as at")
      .leftJoin(
        "t_appointment_canceled_services as acs",
        "acs.appointment_id",
        "=",
        "at.appointment_id"
      )
      .leftJoin(
        "m_merchant_store_services as mss",
        "mss.merchant_store_service_id",
        "=",
        "acs.merchant_store_service_id"
      )
      .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
      .leftJoin(
        "m_service_categories as msc",
        "msc.service_category_id",
        "=",
        "mss.service_category_id"
      )
      .join(
        "m_merchant_stores as mts",
        "at.merchant_store_id",
        "=",
        "mts.merchant_store_id"
      )
      .join(
        "m_account_profiles as mcp",
        "mcp.account_id",
        "=",
        "at.professionist_account_id"
      )
      .where("at.customer_account_id", userId)
      .andWhere((qb) => {
        if (data.search !== undefined) {
          for (const obj of appointmentCancelledModel.where) {
            if (data.search[obj.key])
              qb.where("at." + obj.field, data.search[obj.key]);
          }
        }
      });

    // if (data.sort === undefined) {
    //   knexQuery = knexQuery.orderBy("at.created_at", "desc");
    // } else {
    //   let [column, order] = data.sort.split(":");
    //   const found = appointmentSlotsModel.sort.find((x) => x.key === column);
    //   if (!found) throw new Error('Invalid "sort" field');
    //   column = found.field;

    //   if (order === undefined) order = "asc";

    //   if (order !== "asc" && order !== "desc")
    //     throw new Error('Invalid "sort" order');

    //   knexQuery = knexQuery.orderBy("at." + column, order);
    // }
    // if (data.end) knexQuery = knexQuery.limit(data.end);
    // if (data.start) knexQuery = knexQuery.offset(data.start);

    resultData = await commonService.knexnest(knexQuery, "appointmentId");

    return resultData ? resultData : [];
  } catch (error) {
    console.log("get CustomerAppointments failed" + error);
    throw Error(error);
  }
};

exports.getOneCustomerAppointment = async (appointment_id) => {
  try {
    let resultData = [];
    let knexQuery;
    const checkCancel = await knex
      .select(knex.raw("COUNT(appointment_id) as count"))
      .from(appointmentsModel.table + " as at")
      .where("at.appointment_id", appointment_id);
    if (checkCancel.length && checkCancel[0].count) {
      knexQuery = await knex
        .select(
          "at.appointment_id as _appointmentId",
          knex.raw(
            `DATE_FORMAT(at.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
          ),
          knex.raw(
            `DATE_FORMAT(at.booking_date,'%Y-%m-%d %H:%i:%s') as _bookingDate`
          ),
          knex.raw("CONCAT(ms.name,' - ',msc.name) as _serviceName"),
          "ast.slot_start_time as _slotName",
          "mts.locality as _location",
          "mts.name as _storeName",
          "mcp.first_name as _stylistName",
          "at.booking_id as _bookingId",
          "at.total_price_expected as _totalAmount",
          "at.status as _status",
          knex.raw("? as _cancelReason", [null])
        )
        .from(appointmentsModel.table + " as at")
        .join(
          "t_appointment_slots as ast",
          "ast.appointment_id",
          "=",
          "at.appointment_id"
        )
        .leftJoin(
          "t_appointment_booked_services as abs",
          "abs.appointment_id",
          "=",
          "at.appointment_id"
        )
        .leftJoin(
          "m_merchant_store_services as mss",
          "mss.merchant_store_service_id",
          "=",
          "abs.merchant_store_service_id"
        )
        .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
        .leftJoin(
          "m_service_categories as msc",
          "msc.service_category_id",
          "=",
          "mss.service_category_id"
        )
        .join(
          "m_merchant_stores as mts",
          "ast.merchant_store_id",
          "=",
          "mts.merchant_store_id"
        )
        .join(
          "m_account_profiles as mcp",
          "mcp.account_id",
          "=",
          "ast.professionist_account_id"
        )
        .where("at.appointment_id", appointment_id);
    } else {
      knexQuery = await knex
        .select(
          "at.appointment_id as _appointmentId",
          knex.raw(
            `DATE_FORMAT(at.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
          ),
          knex.raw(
            `DATE_FORMAT(at.booking_date,'%Y-%m-%d %H:%i:%s') as _bookingDate`
          ),
          knex.raw("CONCAT(ms.name,' - ',msc.name) as _serviceName"),
          "at.slot_start_time as _slotName",
          "mts.locality as _location",
          "mts.name as _storeName",
          "mcp.first_name as _stylistName",
          "at.booking_id as _bookingId",
          "at.total_price_expected as _totalAmount",
          knex.raw("? as _status", ["CANCELED"]),
          "at.cancel_reason as _cancelReason"
        )
        .from(appointmentCancelledModel.table + " as at")
        .leftJoin(
          "t_appointment_canceled_services as abs",
          "abs.appointment_id",
          "=",
          "at.appointment_id"
        )
        .leftJoin(
          "m_merchant_store_services as mss",
          "mss.merchant_store_service_id",
          "=",
          "abs.merchant_store_service_id"
        )
        .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
        .leftJoin(
          "m_service_categories as msc",
          "msc.service_category_id",
          "=",
          "mss.service_category_id"
        )
        .join(
          "m_merchant_stores as mts",
          "at.merchant_store_id",
          "=",
          "mts.merchant_store_id"
        )
        .join(
          "m_account_profiles as mcp",
          "mcp.account_id",
          "=",
          "at.professionist_account_id"
        )
        .where("at.appointment_id", appointment_id);
    }
    resultData = await commonService.knexnest(knexQuery, "appointmentId");

    return resultData ? resultData : [];
  } catch (error) {
    console.log("get One CustomerAppointment failed" + error);
    throw Error(error);
  }
};
