const merchantService = require("../services/merchantServices");
const commonService = require("../services/common");
var CryptoJS = require("crypto-js");

module.exports = {
  getAllMerchantServices: async (req, res, next) => {
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
      if (pagination) {
        const perPage = 5;
        let dbCount = await merchantService.getMerchantServiceCount(
          serviceData
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
      response.data = await merchantService.getMerchantServices(serviceData);
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
        if (req.user.type === "ADMIN") {
          response.data = await merchantService.getSingleMerchantService(
            req.params.id
          );
          console.log(response.data, "ADMIN");
        } else {
          response.data = await merchantService.getSingleMerchantServiceUser(
            req.params.id
          );
          console.log(response.data, "USER");
        }
        if (response.data && response.data[0].pictureUrl) {
          let pictureUrl = response.data[0].pictureUrl.split(
            "/service-pictures"
          );
          if (pictureUrl && pictureUrl.length > 1) {
            let thumbnailUrl =
              pictureUrl[0] + "/service-pictures" + pictureUrl[1];
            const s3 = await commonService.newAwsS3();
            response.data[0].pictureUrl = await commonService.getSignedUrl(
              s3,
              thumbnailUrl
            );
          }
        }
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
  createOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      if (req.body.pictureData) {
        const s3 = commonService.newAwsS3();
        const picture = req.body.pictureData
          ? commonService.parseBase64(
              req.body.pictureData,
              "storeServicePicture",
              "service-pictures"
            )
          : null;
        const displayImageThumbnail = picture
          ? await commonService.createThumbnail(picture)
          : null;
        req.body.pictureUrl = picture
          ? await commonService.uploadToS3(s3, picture)
          : null;
        if (displayImageThumbnail)
          await commonService.uploadToS3(s3, displayImageThumbnail);
      }
      await merchantService.insertMerchantService(
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
  updateOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      if (req.body.pictureData) {
        const s3 = commonService.newAwsS3();
        const picture = req.body.pictureData
          ? commonService.parseBase64(
              req.body.pictureData,
              "storeServicePicture",
              "service-pictures"
            )
          : null;
        const displayImageThumbnail = picture
          ? await commonService.createThumbnail(picture)
          : null;
        req.body.pictureUrl = picture
          ? await commonService.uploadToS3(s3, picture)
          : null;
        if (displayImageThumbnail)
          await commonService.uploadToS3(s3, displayImageThumbnail);
      }
      console.log(req.body);
      await merchantService.updateMerchantService(
        req.params.merchantStoreServiceId,
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
  deleteOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.merchantStoreServiceId) {
        let insertTrash = await merchantService.getSingleMerchantService(
          req.params.merchantStoreServiceId
        );
        if (insertTrash.length > 0) {
          insertTrash = insertTrash[0];
          let userId =
            req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
          trashId = await merchantService.insertMerchantServiceTrash(
            insertTrash,
            userId,
            req.user.type
          );
          if (trashId[0]) {
            let id = req.params.merchantStoreServiceId;
            let merchantServicePackDetailsId = await merchantService.merchantServicePackDetails(
              id
            );
            console.log(merchantServicePackDetailsId.length);
            if (merchantServicePackDetailsId.length)
              response.status = { assignedFlag: true };
            // let serviceCategoryId = await merchantService.getServiceGenderCategoryMaps(
            //   id
            // );
            // console.log(serviceCategoryId.length);
            // response.status = { assignedFlag: true };
            let appointmentBookedServicesId = await merchantService.appointmentBookedServices(
              id
            );
            console.log(appointmentBookedServicesId.length);
            if (appointmentBookedServicesId.length)
              response.status = { assignedFlag: true };
            let appointmentCanceledServicesId = await merchantService.appointmentCanceledServices(
              id
            );

            if (appointmentCanceledServicesId.length)
              response.status = { assignedFlag: true };
            let appointmentProvidedServicesId = await merchantService.appointmentProvidedServices(
              id
            );
            if (
              (appointmentProvidedServicesId.length ||
                appointmentCanceledServicesId.length ||
                appointmentBookedServicesId.length ||
                merchantServicePackDetailsId.length) === 0
            ) {
              response.data = await merchantService.deleteMerchantService(
                req.params.merchantStoreServiceId
              );
              response.data = `${response.data} Record(s) deleted`;
              console.log(response.status);
              response.status = "SUCCESS";
            } else {
              response.status = `SUCCESS`;
              response.data = { assignedFlag: true };
            }
          }
        }
      } else throw new Error("Merchant service store id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  requestService: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      await merchantService.insertServiceRequest(
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
  getAllServiceCategories: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.id) {
        response.data = await merchantService.getServiceCategories(
          req.params.id
        );
        response.status = "SUCCESS";
      } else throw new Error("Service category id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getMerchantServicesGroupByService: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await merchantService.getMerchantServicesGroupByService(
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
  merchantServiceList: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await merchantService.merchantServiceList(
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
  getNearbyMerchantStoreServices: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const pagination = req.query.pagination;
      delete req.query.pagination;
      let pageNo = req.query.page || 1;
      delete req.query.page;
      const sort = req.query.sort;
      delete req.query.sort;
      const location = req.query.location;
      delete req.query.location;

      let serviceData = {
        search: req.query || {},
      };
      if (location) {
        let decData = CryptoJS.enc.Base64.parse(location).toString(
          CryptoJS.enc.Utf8
        );
        let bytes = CryptoJS.AES.decrypt(decData, "bocxy").toString(
          CryptoJS.enc.Utf8
        );
        var decryptedData = JSON.parse(bytes);
        serviceData.location = decryptedData;
      }
      if (sort) serviceData.sort = sort;
      let userId;
      if (req.user) {
        userId =
          req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      }
      let dbCount = 0;
      if (pagination) {
        const perPage = 10;
        dbCount = await merchantService.getNearbyMerchantStoreServicesCount(
          serviceData,
          userId
        );
        if (dbCount && dbCount.length) {
          const totalCount = dbCount[0].count;
          const totalPages = Math.ceil(totalCount / perPage);
          serviceData.start = perPage * (Number(pageNo) - 1);
          serviceData.end = perPage;
          response.perPage = perPage;
          response.totalPages = totalPages;
          response.totalCount = totalCount;
        }
      }
      if (dbCount && dbCount.length > 0) {
        response.data = await merchantService.getNearbyMerchantStoreServices(
          serviceData,
          userId
        );
        if (response.data && response.data.length > 0) {
          for (let element of response.data) {
            if (element.pictureUrl) {
              let pictureUrl = element.pictureUrl.split("/service-pictures");
              if (pictureUrl && pictureUrl.length > 1) {
                let thumbnailUrl =
                  pictureUrl[0] +
                  "/service-pictures/thumbnails" +
                  pictureUrl[1];
                const s3 = await commonService.newAwsS3();
                pictureUrl = await commonService.getSignedUrl(s3, thumbnailUrl);
                element.pictureUrl = pictureUrl;
              }
            }
          }
        } else {
          response.data = [];
        }
      } else response.data = [];
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getMerchantStoresList: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await merchantService.getMerchantStoresList();
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getGlobalSearch: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const location = req.query.location;
      delete req.query.location;

      let serviceData = {
        search: req.query || {},
      };

      if (location) {
        let decData = CryptoJS.enc.Base64.parse(location).toString(
          CryptoJS.enc.Utf8
        );
        let bytes = CryptoJS.AES.decrypt(decData, "bocxy").toString(
          CryptoJS.enc.Utf8
        );
        var decryptedData = JSON.parse(bytes);
        serviceData.location = decryptedData;
      }
      response.data = await merchantService.getGlobalSearch(serviceData);
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getMerchantStoreServicesByServiceId: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.merchantStoreServiceId) {
        response.data = await merchantService.getMerchantStoreServicesByServiceId(
          req.params.merchantStoreServiceId
        );
        response.data = response.data[0] || {};
        response.status = "SUCCESS";
      } else throw new Error("Service category id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
