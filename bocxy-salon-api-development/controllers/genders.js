const knexnest = require("knexnest");
const gendersService = require("../services/genders");

module.exports = {
  getAll: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
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
        const perPage = 2;
        const totalCount = (await gendersService.getGenderCount(serviceData))[0]
          .count;
        const totalPages = Math.ceil(totalCount / perPage);
        serviceData.start = perPage * (Number(pageNo) - 1);
        serviceData.end = perPage;
        response.perPage = perPage;
        response.totalPages = totalPages;
        response.totalCount = totalCount;
      }
      response.data = await gendersService.getGenders(serviceData);
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },
  getOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      if (req.params.id) {
        if (req.user.type === "ADMIN")
          response.data = await gendersService.getgender(req.params.id);
        else response.data = await gendersService.getgenderUser(req.params.id);
        response.data = response.data[0] || {};
        response.status = "SUCCESS";
      } else throw new Error("Vehicle Color ID required");
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
      response.data = await gendersService.insertGender(
        req.body,
        req.user.adminId
      );
      response.data = response.data[0] || 0;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },

  updateOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      if (req.params.id) {
        response.data = await gendersService.updateGender(
          req.body,
          req.user.adminId,
          req.params.id
        );
        response.data = `${response.data} Record(s) updated`;
        response.status = "SUCCESS";
      } else throw new Error("Vehicle Color ID required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },

  deleteOne: async (req, res, next) => {
    let response = {};
    response.data = [];
    let statusCode = 200;
    try {
      if (req.params.id) {
        let insertTrash = await gendersService.getgender(req.params.id);
        if (insertTrash.length > 0) {
          insertTrash = insertTrash[0];
          trashId = await gendersService.insertGenderTrash(
            insertTrash,
            req.user.adminId
          );
          if (trashId[0]) {
            response.data = await gendersService.deleteGender(req.params.id);
            response.data = `${response.data} Record(s) deleted`;
          }
        }

        response.status = "SUCCESS";
      } else throw new Error("Vehicle Color ID required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(statusCode).json(response);
  },
};
