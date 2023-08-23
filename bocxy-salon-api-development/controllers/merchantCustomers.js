const merchantCustomersService = require("../services/merchantCustomers");
const accountsService = require("../services/accounts");

module.exports = {
  visited: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId = req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
 
      const pagination = req.query.pagination;
      delete req.query.pagination; 
      let pageNo = req.query.page || 1;
      delete req.query.page;
      const sort = req.query.sort;
      delete req.query.sort;
      console.log(req.query.sort);
      let serviceData = {
        search: req.query || {},
      };
      console.log(serviceData);
      if (sort) serviceData.sort = sort;
      if (pagination) {
        const perPage = 10;
        let dbCount = await merchantCustomersService.getVisitedCustomerCount(
          serviceData,merchantStoreId
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
              response.data = await merchantCustomersService.getVisited(merchantStoreId,serviceData);
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },

  regular: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId = req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
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
      if (pagination) {
        const perPage = 10;
        let dbCount = await merchantCustomersService.getRegularCustomerCount(
          serviceData,merchantStoreId
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

      response.data = await merchantCustomersService.getRegular(merchantStoreId,serviceData);
      console.log(response.data);
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },

};
