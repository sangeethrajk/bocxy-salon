const merchantHolidaysService = require("../services/merchantHolidays");
const accountsService = require("../services/accounts");

module.exports = {
  getMerchantHolidays: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const pagination = req.query.pagination;
      delete req.query.pagination;
      let pageNo = req.query.page || 1;
      delete req.query.page;
      const sort = req.query.sort;
      delete req.query.sort;

      let serviceData = {
        search: req.query || {},
      };
      if (sort) serviceData.sort = sort;
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
      if (pagination) {
        const perPage = 10;
        let dbCount = await merchantHolidaysService.getMerchantHolidaysCount(
          serviceData,
          merchantStoreId
        );
        if (dbCount.length) {
          const totalCount = dbCount[0].count;
          const totalPages = Math.ceil(totalCount / perPage);
          serviceData.start = perPage * (Number(pageNo) - 1);
          serviceData.end = perPage;
          response.perPage = perPage;
          response.totalPages = totalPages;
          response.totalCount = totalCount;
        }
      }
      response.data = await merchantHolidaysService.getMerchantHolidaysByName(
        serviceData,
        merchantStoreId
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.id) {
        if (req.user.type === "ADMIN")
          response.data = await merchantHolidaysService.getSingleMerchantHoliday(
            req.params.id
          );
        else
          response.data = await merchantHolidaysService.getSingleMerchantHolidayUser(
            req.params.id
          );
        response.data = response.data[0] || {};
        response.status = "SUCCESS";
      } else throw new Error("Merchant service store id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  createMerchantHolidays: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      await merchantHolidaysService.createMerchantHolidays(
        req.body,
        userId,
        req.user.type
      );
      response.data = "true";
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  updateMerchantHolidays: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      await merchantHolidaysService.updateMerchantHolidays(
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
  deleteMerchantHoliday: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.id) {
        let insertTrash = await merchantHolidaysService.getSingleMerchantHoliday(
          req.params.id
        );
        if (insertTrash.length > 0) {
          insertTrash = insertTrash[0];
          let userId =
            req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
          trashId = await merchantHolidaysService.insertOneTrash(
            insertTrash,
            userId,
            req.user.type
          );
          if (trashId[0]) {
            response.data = await merchantHolidaysService.deleteMerchantHoliday(
              req.params.id
            );
            response.data = true;
          }
        }
        response.status = "SUCCESS";
      } else throw new Error("Merchant Holiday id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
