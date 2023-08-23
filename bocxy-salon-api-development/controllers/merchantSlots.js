const merchantSlotsService = require("../services/merchantSlots");
const accountsService = require("../services/accounts");

module.exports = {
  getMerchantSlot: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.merchantSlotId) {
        response.data = await merchantSlotsService.getMerchantSlot(
          req.params.merchantSlotId
        );
        response.status = "SUCCESS";
      } else throw new Error("Merchant Slot Id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getMerchantSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await merchantSlotsService.getMerchantSlots(
        userId,
        req.user.type
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  createMerchantSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      response.data = await merchantSlotsService.createMerchantSlots(
        req.body,
        userId,
        req.user.type
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  merchantSlotList: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await merchantSlotsService.merchantSlotList(
        userId,
        req.user.type
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getOnemerchantSlots: async (req, res, next) => {
    let response = {};
    response.data = {};
    let statusCode = 200;
    try {
      if (req.params.merchantSlotId) {
        let userId =
          req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
        let resData = await merchantSlotsService.getMerchantSlotsBySlotId(
          req.params.merchantSlotId,
          userId
        );
        response.data = resData.length > 0 ? resData[0] : {};
        response.status = "SUCCESS";
      } else {
        response.status = "FAILURE";
        response.data = "Slot Id required";
      }
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },
  checkSlotsStartDate: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
      const resData = await merchantSlotsService.checkSlotsStartDate(
        req.query.startDate,
        merchantStoreId
      );
      response.data = resData;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },

  createStoreDefaultSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      response.data = await merchantSlotsService.createStoreDefaultSlots(
        req.body,
        userId
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },

  getStoreDefaultSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await merchantSlotsService.getStoreDefaultSlots(userId);
      response.status = "SUCCESS";
      response.data = response.data[0] || {};
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  checkSlotExist: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      resData = await merchantSlotsService.getCheckMerchantSlotsName(
        userId,
        req.query.name
      );
      response.data = resData.length > 0 ? true : false;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  checkSplSlotExist: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      resData = await merchantSlotsService.getCheckMerchantSplSlotsName(
        userId,
        req.query.name
      );
      response.data = resData.length > 0 ? true : false;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
