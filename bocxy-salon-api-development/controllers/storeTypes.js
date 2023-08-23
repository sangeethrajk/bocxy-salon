const knexnest = require("knexnest");
const storeService = require("../services/storeTypes");

module.exports = {
  getAll: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await storeService.getAll();
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
      response.data = await storeService.getAllList();
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
          response.data = await storeService.getOne(req.params.id);
        else response.data = await storeService.getOneOfUser(req.params.id);
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
      await storeService.insertOne(req.body, userId, req.user.type);
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
      await storeService.updateOne(req.params.id, req.body, userId);
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
        let checkField = await checkAllTables(req.params.id);
        if (checkField.assignedFlag) {
          response.data = checkField;
          response.status = "FAILURE";
        } else {
          let insertTrash = await storeService.getOne(req.params.id);
          if (insertTrash.length > 0) {
            insertTrash = insertTrash[0];
            let userId =
              req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
            trashId = await storeService.insertOneTrash(insertTrash, userId);
            if (trashId[0]) {
              response.data = await storeService.deleteOne(req.params.id);
              response.data = `${response.data} Record(s) deleted`;
            }
          }
          response.status = "SUCCESS";
        }
      } else throw new Error("Store type id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};

async function checkAllTables(id) {
  let merchantStoreMaps = await checkReferenceValueExists(
    "m_merchant_stores",
    id
  );
  if (merchantStoreMaps.length > 0) {
    return { assignedFlag: true };
  }
  let storeTypeProfessionsMaps = await checkReferenceValueExists(
    "m_store_type_professions",
    id
  );
  if (storeTypeProfessionsMaps.length > 0) {
    return { assignedFlag: true };
  }
  let storeTypeServicesMaps = await checkReferenceValueExists(
    "m_store_type_services",
    id
  );
  if (storeTypeServicesMaps.length > 0) {
    return { assignedFlag: true };
  }
}

async function checkReferenceValueExists(table, id) {
  return await storeService.getStoreTypeIdRef(table, id);
}
