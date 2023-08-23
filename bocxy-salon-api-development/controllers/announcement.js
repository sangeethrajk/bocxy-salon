const knexnest = require("knexnest");
const annoucementService = require("../services/announcement");
const accountsService = require("../services/accounts");
const customerNotificationService = require("../services/customerNotification");
module.exports = {
  // getAll: async (req, res, next) => {
  //   let response = {};
  //   response.data = [];
  //   let statusCode = 200;
  //   try {
  //     const pagination = req.query.pagination;
  //     delete req.query.pagination;
  //     let pageNo = req.query.page || 1;
  //     delete req.query.page;
  //     const sort = req.query.sort;
  //     delete req.query.sort;

  //     let serviceData = {
  //       search: req.query || {},
  //     };
  //     if (sort) serviceData.sort = sort;
  //     if (pagination) {
  //       const perPage = 2;
  //       const totalCount = (await annoucementService.getGenderCount(serviceData))[0]
  //         .count;
  //       const totalPages = Math.ceil(totalCount / perPage);
  //       serviceData.start = perPage * (Number(pageNo) - 1);
  //       serviceData.end = perPage;
  //       response.perPage = perPage;
  //       response.totalPages = totalPages;
  //       response.totalCount = totalCount;
  //     }
  //     response.data = await annoucementService.getGenders(serviceData);
  //     response.status = "SUCCESS";
  //   } catch (err) {
  //     console.log(err);
  //     response.status = "FAILURE";
  //     response.data = err;
  //   }
  //   res.status(statusCode).json(response);
  // },
  getOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      console.log(req.params);
      response.data = await annoucementService.getAnnoucement(
        req.params.annoucementId
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },

  createOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      let serviceData = {};
      let accountIds;
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
      response.data = await annoucementService.insertAnnouncement(
        req.body,
        merchantStoreId
      );
      if (req.body.customerType == "ALL") {
        accountIds = await annoucementService.getAll(
          serviceData,
          merchantStoreId
        );
      } else if (req.body.customerType == "REGULAR") {
        accountIds = await annoucementService.getRegular(
          serviceData,
          merchantStoreId
        );
      }
      let accountidArray = [];
      chunk_size = 10;
      accountidArray = accountIds.map((x) => x.customerId);
      let CustomerNotfications = customerNotificationService.insertCustomerAnnouncement(
        accountidArray,
        response.data
      );
      const payload = {
        notification: {
          title: req.body.title,
          body: req.body.content,
          // click_action: "FCM_PLUGIN_ACTIVITY",
          sound: "default", //If you want notification sound
          icon:
            "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/car_compact2.png",
        },
        data: {
          Type: "Annoucement", //Any data to be retrieved in the notification callback
        },
      };
      let i,
        j,
        notiRes,
        arrayLimit = 10;
      if (accountidArray.length > 0) {
        for (i = 0, j = accountIds.length; i < j; i += arrayLimit) {
          notiRes = accountidArray.slice(i, i + arrayLimit);
          await annoucementService.pushNotificationToAccounts(notiRes, payload);
        }
      } else {
        notiRes = "empty users";
      }
      if (notiRes) {
        response.data = await annoucementService.failedStatus(response.data[0]);
      } else {
        response.data = await annoucementService.CompletedStatus(
          response.data[0]
        );
      }
      response.data = response.data || 0;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.data = await annoucementService.failedStatus(response.data[0]);
      response.status = "FAILED";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },

  // updateOne: async (req, res, next) => {
  //   let response = {};
  //   response.data = [];
  //   let statusCode = 200;
  //   try {
  //     if (req.params.id) {
  //       response.data = await annoucementService.updateGender(
  //         req.body,
  //         req.user.adminId,
  //         req.params.id
  //       );
  //       response.data = `${response.data} Record(s) updated`;
  //       response.status = "SUCCESS";
  //     } else throw new Error("Vehicle Color ID required");
  //   } catch (err) {
  //     console.log(err);
  //     response.status = "FAILURE";
  //     response.data = err;
  //   }
  //   res.status(statusCode).json(response);
  // },

  // deleteOne: async (req, res, next) => {
  //   let response = {};
  //   response.data = [];
  //   let statusCode = 200;
  //   try {
  //     if (req.params.id) {
  //       let insertTrash = await annoucementService.getgender(req.params.id);
  //       if (insertTrash.length > 0) {
  //         insertTrash = insertTrash[0];
  //         trashId = await gendersService.insertGenderTrash(
  //           insertTrash,
  //           req.user.adminId
  //         );
  //         if (trashId[0]) {
  //           response.data = await gendersService.deleteGender(req.params.id);
  //           response.data = `${response.data} Record(s) deleted`;
  //         }
  //       }

  //       response.status = "SUCCESS";
  //     } else throw new Error("Vehicle Color ID required");
  //   } catch (err) {
  //     console.log(err);
  //     response.status = "FAILURE";
  //     response.data = err;
  //   }
  //   res.status(statusCode).json(response);
  // },
};
