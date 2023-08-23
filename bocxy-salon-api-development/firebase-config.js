const admin = require("firebase-admin");

const merchantAccount = require("./data/bocxy-partner-firebase-adminsdk-6umdi-2e2f76f666.json");

const merchant = admin.initializeApp(
  {
    credential: admin.credential.cert(merchantAccount),
    databaseURL: "https://bocxy-partner.firebaseio.com",
  },
  "merchant"
);

module.exports.merchant = merchant;

const customerAccount = require("./data/bocxy-app-firebase-adminsdk-1by95-553174b0be.json");

const customer = admin.initializeApp(
  {
    credential: admin.credential.cert(customerAccount),
    databaseURL: "https://bocxy-app.firebaseio.com",
  },
  "customer"
);

module.exports.customer = customer;
