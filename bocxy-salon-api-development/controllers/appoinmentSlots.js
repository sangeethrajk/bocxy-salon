const appointmentSlotsService = require("../services/appoinmentSlots");
const accountsService = require("../services/accounts");

module.exports = {
  slotGroupList: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await appointmentSlotsService.slotGroupList();
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getAppointmentSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.date) {
        let userId =
          req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
        response.data = await appointmentSlotsService.getAppointmentSlots(
          userId,
          req.user.type,
          req.params.date,
          req.params.merchantStoreServiceId
        );
        response.status = "SUCCESS";
      } else throw new Error("Appoinment date is empty");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getAppointmentStylistSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await appointmentSlotsService.getAppointmentStylistSlots(
        userId,
        req.params.stylistAccountId,
        req.params.date,
        req.params.merchantStoreServiceId,
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
  getAppointmentDates: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await appointmentSlotsService.getAppointmentDates(
        userId,
        req.params.merchantStoreServiceId,
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
  createAppointment: async (req, res, next) => {
    let response = {};
    response.data = {};
    let reqBody = req.body;
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await appointmentSlotsService.createAppointment(
        reqBody,
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

  createAppointmentServiceTemporary: async (req, res, next) => {
    let response = {};
    response.data = {};
    let reqBody = req.body;
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await appointmentSlotsService.createAppointmentServiceTemporary(
        reqBody,
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

  getMerchantDashboardAppointments: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await appointmentSlotsService.getMerchantDashboardAppointments(
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
  getMerchantAppointments: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      const pagination = req.query.pagination;
      delete req.query.pagination;
      let pageNo = req.query.page || 1;
      delete req.query.page;
      const sort = req.query.sort;
      delete req.query.sort;

      const queryOrderType = req.query.queryOrderType;
      delete req.query.queryOrderType;

      let serviceData = {
        search: req.query || {},
      };
      if (serviceData.search.type) {
        serviceData.search.type = serviceData.search.type.split(",");
      }
      if (serviceData.search.status) {
        serviceData.search.status = serviceData.search.status.split(",");
      }
      if (sort) serviceData.sort = sort;
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
      if (pagination) {
        const perPage = 5;
        let dbCount = await appointmentSlotsService.getMerchantAppointmentsCount(
          merchantStoreId,
          queryOrderType,
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
      response.data = await appointmentSlotsService.getMerchantAppointments(
        merchantStoreId,
        queryOrderType,
        serviceData
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },

  getOneMerchantAppointment: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.appointmentId) {
        response.data = await appointmentSlotsService.getOneMerchantAppointment(
          req.params.appointmentId
        );
        response.data = response.data[0] || {};
        response.status = "SUCCESS";
      } else throw new Error("Appointment id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },

  getMerchantCanceledAppointments: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
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
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
      if (pagination) {
        const perPage = 5;
        let dbCount = await appointmentSlotsService.getMerchantCanceledAppointmentsCount(
          merchantStoreId,
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
      response.data = await appointmentSlotsService.getMerchantCanceledAppointments(
        merchantStoreId,
        serviceData
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  updateAppointmentStatus: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    let userType = req.user.type === "MERCHANT" ? "USER" : req.user.type;
    try {
      await appointmentSlotsService.updateAppointmentStatus(
        req.body,
        userId,
        userType
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
  getStylistByService: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await appointmentSlotsService.getStylistByService(
        userId,
        req.params.merchantServiceId,
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
  getMerchantOngoingAppointments: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      const pagination = req.query.pagination;
      delete req.query.pagination;
      let pageNo = req.query.page || 1;
      delete req.query.page;
      const sort = req.query.sort;
      delete req.query.sort;

      let serviceData = {
        search: req.query || {},
      };
      if (serviceData.search.status) {
        serviceData.search.status = serviceData.search.status.split(",");
      }
      if (sort) serviceData.sort = sort;
      let merchantStoreId = await accountsService.getMerchantStoreId(userId);
      if (pagination) {
        const perPage = 10;
        let dbCount = await appointmentSlotsService.getMerchantOngoingAppointmentsCount(
          merchantStoreId,
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
      response.data = await appointmentSlotsService.getMerchantOngoingAppointments(
        merchantStoreId,
        serviceData
      );
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
