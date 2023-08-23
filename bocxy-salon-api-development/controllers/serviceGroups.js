const knexnest = require("knexnest");
const serviceGroupsService = require("../services/serviceGroups");

module.exports = {
  getAll: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const pagination = req.query.pagination;
      delete req.query.pagination;
      let pageNo = req.query.page || 1;
      delete req.query.page;
      if (pagination) {
        const perPage = 5;
        let dbCount = await serviceGroupsService.getAllCount();
        if (dbCount.length) {
          const totalCount = dbCount[0].count;
          const totalPages = Math.ceil(totalCount / perPage);
          response.perPage = perPage;
          response.totalPages = totalPages;
          response.totalCount = totalCount;
        }
      }
      response.data = await serviceGroupsService.getAll();
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },

  getAllList: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      // const pagination = req.query.pagination;
      // delete req.query.pagination;
      // let pageNo = req.query.page || 1;
      // delete req.query.page;
      // if (pagination) {
      //   const perPage = 5;
      //   let dbCount = await serviceGroupsService.getAllCount();
      //   if (dbCount.length) {
      //     const totalCount = dbCount[0].count;
      //     const totalPages = Math.ceil(totalCount / perPage);
      //     response.perPage = perPage;
      //     response.totalPages = totalPages;
      //     response.totalCount = totalCount;
      //   }
      // }
      response.data = await serviceGroupsService.getAllList();
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
        if (req.user.type === "MERCHANT")
          response.data = await serviceGroupsService.getOne(req.params.id);
        else
          response.data = await serviceGroupsService.getOneOfUser(
            req.params.id
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
      await serviceGroupsService.insertOne(req.body, userId, req.user.type);
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
      await serviceGroupsService.updateOne(req.params.id, req.body, userId);
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
      if (req.params.id) {
        let insertTrash = await serviceGroupsService.getOne(req.params.id);
        if (insertTrash.length > 0) {
          insertTrash = insertTrash[0];
          let userId =
            req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
          trashId = await serviceGroupsService.insertOneTrash(
            insertTrash,
            userId
          );
          if (trashId[0]) {
            response.data = await serviceGroupsService.deleteOne(req.params.id);
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
};
