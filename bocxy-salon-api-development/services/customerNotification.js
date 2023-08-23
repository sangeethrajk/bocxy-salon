const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const customerNotificationModel = require("../models/customerNotification");

exports.getCustomerNotificationCount = (accountId) =>
  knex
    .select(
      knex.raw(`COUNT(${customerNotificationModel.columns[0].field}) AS count`)
    )
    .from(customerNotificationModel.table)
    .where(customerNotificationModel.columns[1].field, accountId)
    .andWhere(customerNotificationModel.columns[5].field, "N");

exports.getCustomerNotifications = async (accountId) => {
  try {
    return knex
      .select(
        "cn.customer_notification_id as notificationId",
        "cn.type as type",
        "cn.type_data as typeData",
        "ms.name as StoreName",
        "an.title as title",
        "an.content as content",
        "cn.read as read",
        "msc.name as StoreNameCanceled",
        "tac.cancel_reason as cancelReason",
        "an.announcement_id as announcementId ",
        "cn.appointment_id as appointmentId",
        knex.raw(
          `DATE_FORMAT(a.created_at,'%Y-%m-%d %H:%i:%s') as appointmentCreatedTime`
        ),
        knex.raw(
          `DATE_FORMAT(an.created_at,'%Y-%m-%d %H:%i:%s') as annoucementCreatedTime`
        ),
        "ms.locality as locality",

        "ac.customer_app_version as version"
      )
      .from("t_customer_notifications as cn")
      .leftJoin(
        "t_appointments as a",
        "a.appointment_id",
        "=",
        "cn.appointment_id"
      )
      .leftJoin(
        "t_appointment_slots as ast",
        "ast.appointment_id",
        "=",
        "a.appointment_id"
      )
      .leftJoin(
        "t_appointments_canceled as tac",
        "tac.appointment_id",
        "=",
        "cn.appointment_id"
      )
      .leftJoin(
        "m_merchant_stores as ms",
        "ms.merchant_store_id",
        "=",
        "ast.merchant_store_id"
      )
      .leftJoin(
        "m_merchant_stores as msc",
        "msc.merchant_store_id",
        "=",
        "tac.merchant_store_id"
      )
      .leftJoin(
        "t_announcements as an",
        "an.announcement_id",
        "=",
        "cn.announcement_id"
      )
      .leftJoin("app_config as ac", "cn.type", "=", knex.raw("?", ["UPDATE"]))
      .where("cn.account_id", accountId)
      .orderBy("cn.customer_notification_id", "desc");
  } catch (error) {
    console.log("getCustomerNotifications failed" + error);
    throw Error(error);
  }
};
exports.updateCustomerNotification = async (id, updatedBy) =>
  await knex(customerNotificationModel.table)
    .update({
      read: "Y",
    })
    .where(customerNotificationModel.columns[0].field, id);

exports.insertCustomerAnnouncement = async (accountId, annoucementId) => {
  let notficationsData = [];
  accountId.forEach((accountId) => {
    notficationsData.push({
      account_id: accountId,
      type: "ANNOUNCEMENT",
      announcement_id: annoucementId,
      read: "N",
    });
  });
  console.log(notficationsData);
  await knex(customerNotificationModel.table).insert(notficationsData);
};
