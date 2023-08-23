const knexnest = require("knexnest");
const notificationsService = require("../services/userNotfications");
const merchantNotificationService = require("../services/merchantNotification");
module.exports = {
  registerNew: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      console.log(req.body.token, "TOKEN ID");
      // if (!req.body.token) throw new Error("Invalid Token");
      console.log(req.user.accountId, "USERid");
      response.data = await notificationsService.saveToken(
        req.body.token,
        req.user.accountId
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },
  registerNewMerchant: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      console.log(req.body.token, "TOKEN ID");
      // if (!req.body.token) throw new Error("Invalid Token");
      console.log(req.user.accountId, "USERid");
      response.data = await merchantNotificationService.saveToken(
        req.body.token,
        req.user.accountId
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },
};
