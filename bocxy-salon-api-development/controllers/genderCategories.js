const knexnest = require("knexnest");
const genderCategoriesService = require("../services/genderCategories");

module.exports = {
  getAll: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await genderCategoriesService.getAll();
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
      response.data = await genderCategoriesService.getAllList();
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
          response.data = await genderCategoriesService.getOne(req.params.id);
        else
          response.data = await genderCategoriesService.getOneOfUser(
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
      await genderCategoriesService.insertOne(req.body, userId, req.user.type);
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
      await genderCategoriesService.updateOne(req.params.id, req.body, userId);
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
        let insertTrash = await genderCategoriesService.getOne(req.params.id);
        if (insertTrash.length > 0) {
          insertTrash = insertTrash[0];
          let userId =
            req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
          trashId = await genderCategoriesService.insertOneTrash(
            insertTrash,
            userId
          );
          if (trashId[0]) {
            response.data = await genderCategoriesService.deleteOne(
              req.params.id
            );
            response.data = `${response.data} Record(s) deleted`;
          }
        }
        response.status = "SUCCESS";
      } else throw new Error("Gender category id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
