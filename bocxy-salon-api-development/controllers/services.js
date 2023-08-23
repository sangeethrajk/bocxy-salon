const servicesService = require("../services/services");

module.exports = {
  getAllServices: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await servicesService.getAllServices();
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
      if (req.params.serviceId) {
        if (req.user.type === "ADMIN")
          response.data = await servicesService.getService(
            req.params.serviceId
          );
        else
          response.data = await servicesService.getServiceUser(
            req.params.serviceId
          );
        response.data = response.data[0] || {};
        response.status = "SUCCESS";
      } else throw new Error("Service id is required");
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
      await servicesService.insertService(req.body, userId, req.user.type);
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
      await servicesService.updateService(
        req.params.serviceId,
        req.body,
        userId
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
      if (req.params.serviceId) {
        let insertTrash = await servicesService.getService(
          req.params.serviceId
        );
        if (insertTrash.length > 0) {
          insertTrash = insertTrash[0];
          let userId =
            req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
          trashId = await servicesService.insertServiceTrash(
            insertTrash,
            userId
          );
          if (trashId[0]) {
            response.data = await servicesService.deleteService(
              req.params.serviceId
            );
            response.data = `${response.data} Record(s) deleted`;
          }
        }
        response.status = "SUCCESS";
      } else throw new Error("Service id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getServicesList: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const serviceGroupId = req.query.serviceGroupId;
      if(serviceGroupId){
        response.data = await servicesService.getServicesListForServiceGroupId(serviceGroupId);
      }
      else {
        response.data = await servicesService.getServicesList();
      }
      response.status = "SUCCESS";

    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
