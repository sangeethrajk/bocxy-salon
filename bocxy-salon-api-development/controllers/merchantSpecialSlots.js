const merchantSpecialSlotsService = require("../services/merchantSpecialSlots");
const accountsService = require("../services/accounts");

module.exports = {
  getMerchantSpecialSlot: async (req, res, next) => {
    let response = {};
    response.data = {};
    try {
      if (req.params.merchantSpecialSlotId) {
        let resData = await merchantSpecialSlotsService.getMerchantSpecialSlot(
          req.params.merchantSpecialSlotId
        );
        response.status = "SUCCESS";
        response.data = resData.length > 0 ? resData[0] : {};
      } else throw new Error("Merchant Special Slot Id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getMerchantSpecialSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await merchantSpecialSlotsService.getMerchantSpecialSlots(
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

  getMerchantSpecialSlotsList: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await merchantSpecialSlotsService.getMerchantSpecialSlotsList(
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
  createMerchantSpecialSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      response.data = await merchantSpecialSlotsService.createMerchantSpecialSlots(
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
  updateMerchantSpecialSlot: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      await merchantSpecialSlotsService.updateMerchantSpecialSlot(
        req.params.id,
        req.body,
        userId,
        req.user.type
      );
      response.data = true;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  deleteMerchantSpecialSlot: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.id) {
        let insertTrash = await merchantSpecialSlotsService.getMerchantSpecialSlotData(
          req.params.id
        );
        if (insertTrash.length > 0) {
          insertTrash = insertTrash[0];
          let userId =
            req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
          trashId = await merchantSpecialSlotsService.insertOneTrash(
            insertTrash,
            userId,
            req.user.type
          );
          if (trashId[0]) {
            response.data = await merchantSpecialSlotsService.deleteMerchantSpecialSlot(
              req.params.id
            );
            response.data = true;
          }
        }
        response.status = "SUCCESS";
      } else throw new Error("Merchant Special Slot id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  checkSpecialSlotsByDate: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
      const resData = await merchantSpecialSlotsService.checkSpecialSlotsByDate(
        req.query.startDate,
        req.query.endDate,
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
};
