const customer = require("../firebase-config").customer;
const db = customer.firestore();

exports.saveToken = (token, accountId) => {
  const devicesRef = db.collection("devices");

  const data = {
    token,
    accountId,
  };

  return devicesRef.doc(token).set(data);
};

exports.pushNotificationToAccounts = async (accountIds, payload) => {
  const devicesRef = db
    .collection("devices")
    .where("accountId", "in", accountIds);
  const devices = await devicesRef.get();
  let tokens = [];
  devices.forEach((result) => {
    const token = result.data().token;
    tokens.push(token);
  });
  return admin.messaging().sendToDevice(tokens, payload);
};
