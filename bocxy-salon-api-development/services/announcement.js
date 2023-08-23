const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const model = require("../models/announcement");

const customer = require("../firebase-config").customer;
const db = customer.firestore();

exports.insertAnnouncement = (insertData, id) =>
  knex(model.table).insert(
    Object.assign(model.checkFields(insertData, false), {
      merchant_store_id: id,
    })
  );
exports.getAnnoucement = (id) => {
  return knex
    .select(
      "an.merchant_store_id as merchantStoreId",
      "an.customer_type as customerType",
      "an.title as title",
      "an.content as content",
      "mts.name as _storeName",
      knex.raw(`DATE_FORMAT(an.created_at,'%Y-%m-%d %H:%i:%s')as createdAt`)
    )
    .from(model.table + " as an")
    .join(
      "m_merchant_stores as mts",
      "mts.merchant_store_id",
      "=",
      "an.merchant_store_id"
    )
    .where(model.columns[0].field, id);
};
exports.getRegular = (data, merchantID = []) =>
  knex
    .select("customer_id AS customerId")
    .from("t_merchant_customers")
    .where((qb) => {
      qb.where(`merchant_store_id`, merchantID),
        qb.where("visit_count", ">=", 2);
    });

exports.getAll = (data, merchantID = []) =>
  knex
    .select("customer_id AS customerId")
    .from("t_merchant_customers")
    .where((qb) => {
      qb.where(`merchant_store_id`, merchantID);
    });

exports.pushNotificationToAccounts = async (accountIds, payload) => {
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
    return customer.messaging().sendToDevice(tokens, payload);
  }
};

exports.CompletedStatus = (id) => {
  return knex("t_announcements").where("announcement_id", id).update({
    status: "COMPLETED",
  });
};

exports.failedStatus = (id) => {
  return knex("t_announcements").where("announcement_id", id).update({
    status: "FAILED",
  });
};
