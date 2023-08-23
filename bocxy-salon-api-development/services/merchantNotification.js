const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const merchantNotificationModel = require("../models/merchantNotification");
const loginService = require("./login");
const merchant = require("../firebase-config").merchant;
const db = merchant.firestore();
exports.getMerchantNotificationCount = (accountId) =>
  knex
    .select(
      knex.raw(`COUNT(${merchantNotificationModel.columns[0].field}) AS count`)
    )
    .from(merchantNotificationModel.table)
    .where(merchantNotificationModel.columns[1].field, accountId)
    .andWhere(merchantNotificationModel.columns[4].field, "N");

exports.getMerchantNotifications = async (accountId) => {
  try {
    return knex
      .select(
        "mn.type as type",
        "mn.merchant_notification_id as notificationId",
        "a.customer_name as customerName",
        "tac.customer_name as customerNameCanceled",
        "mn.read as read",
        "mn.appointment_id as appointmentId",
        knex.raw(
          `DATE_FORMAT(a.created_at,'%Y-%m-%d %H:%i:%s') as appointmentCreatedTime`
        ),
        knex.raw(
          `DATE_FORMAT(tac.created_at,'%Y-%m-%d %H:%i:%s') as appointmentCreatedTimeCanceled`
        ),
        "ac.merchant_app_version as version"
      )
      .from("t_merchant_notifications as mn")
      .leftJoin(
        "t_appointments as a",
        "a.appointment_id",
        "=",
        "mn.appointment_id"
      )
      .leftJoin(
        "t_appointments_canceled as tac",
        "tac.appointment_id",
        "=",
        "mn.appointment_id"
      )
      .leftJoin("app_config as ac", "mn.type", "=", knex.raw("?", ["UPDATE"]))
      .where("mn.account_id", accountId)
      .orderBy("mn.merchant_notification_id", "desc");
  } catch (error) {
    console.log("getMerchantNotifications failed" + error);
    throw Error(error);
  }
};

exports.updateMerchantNotification = async (id, updatedBy) =>
  await knex(merchantNotificationModel.table)
    .update({
      read: "Y",
    })
    .where(merchantNotificationModel.columns[0].field, id);

exports.pushNotificationToCustomerAccounts = async (accountIds, payload) => {
  const devicesRef = db
    .collection("devices")
    .where("accountId", "in", accountIds);
  const devices = await devicesRef.get();
  let tokens = [];
  devices.forEach((result) => {
    console.log(result);
    const token = result.data().token;
    tokens.push(token);
  });

  if (tokens !== null && tokens != "") {
    return merchant.messaging().sendToDevice(tokens, payload);
  }
};

exports.saveToken = (token, accountId) => {
  const devicesRef = db.collection("devices");

  const data = {
    token,
    accountId,
  };

  return devicesRef.doc(token).set(data);
};
