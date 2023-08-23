const professionistService = require("../services/professionist");
const registerService = require("../services/register");
const accountsService = require("../services/accounts");
//const Cryptr = require('cryptr');
const secretKey = require("../data/secretKey");
//const cryptr = new Cryptr(secretKey.salt);
const constants = require("../data/constants");

module.exports = {
  getAllProfessionist: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await professionistService.getAllProfessionist(userId);
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
      if (req.params.professionistId) {
        if (req.user.type === "ADMIN")
          response.data = await professionistService.getProfessionist(
            req.params.professionistId
          );
        else
          response.data = await professionistService.getProfessionistUser(
            req.params.professionistId
          );
        response.data = response.data[0] || {};
        response.status = "SUCCESS";
      } else throw new Error("professionist id is required");
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
      await professionistService.insertProfessionist(
        req.body,
        userId,
        req.user.type
      );
      registerService.sendSms2(req.body, "PARTNER_LINK");
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
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      await professionistService.updateProfessionist(
        req.params.professionistId,
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
      if (req.params.professionistId) {
        let userId =
          req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
        let mapping = await professionistService.checkMerchantProfessionistMapping(
          userId,
          req.params.professionistId
        );
        if (mapping) {
          let insertTrash = await accountsService.getAccountForTrash(
            req.params.professionistId
          );
          if (insertTrash.length > 0) {
            insertTrash = insertTrash[0];
            let roleIdarray = await professionistService.checkMerchantRoleId(
              userId
            );
            let RoleIdmap = roleIdarray.map((x) => x.role_id);
            roleIdwithComma = RoleIdmap.join(", ");

            insertTrash.role_id = roleIdwithComma;
            insertTrash.created_by = userId;
            console.log(insertTrash);
            trashId = await accountsService.insertTrashAccounts(
              insertTrash,
              userId
            );
            if (trashId[0]) {
              const checkForignKey = await professionistService.AccountForignKey(
                req.params.professionistId
              );
              if (checkForignKey == true) {
                response.data = await accountsService.deleteAccount(
                  req.params.professionistId
                );
                response.data = `${response.data} Record(s) deleted`;
                response.status = "SUCCESS";
              } else {
                response.data = { assignedFlag: true };
                response.status = "SUCCESS";
              }
            }
          }
        } else throw new Error("Professionist is not associated to Merchant");
      } else throw new Error("Professionist id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getProfessionistProfileComplete: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await professionistService.getProfessionistByMobileNo(
        req.query.mobileNo,
        req.query.dialCode
      );
      response.data = response.data.length > 0 ? response.data[0] : {};
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getAllProfessions: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await professionistService.getAllProfessions();
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  professionistSlots: async (req, res, next) => {
    let response = {};
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      if (req.body.accountId) {
        let mapping = await professionistService.checkMerchantProfessionistMapping(
          userId,
          req.body.accountId
        );
        if (mapping) {
          if (req.body.slotType === "REGULAR") {
            await professionistService.insertProfessionistSlot(
              req.body.accountId,
              req.body
            );
            response.data = true;
            response.status = "SUCCESS";
          } else if (req.body.slotType === "SPECIAL") {
            await professionistService.insertProfessionistSpecialSlot(
              req.body.accountId,
              req.body
            );
            response.data = true;
            response.status = "SUCCESS";
          } else throw new Error("Slot Type required");
        } else throw new Error("Professionist is not associated to Merchant");
      } else throw new Error("Professionist id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getMerchantProfessionistSlots: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.professionistAccountId) {
        if (req.params.slotType === "REGULAR") {
          response.data = await professionistService.getMerchantProfessionistSlots(
            req.params.professionistAccountId,
            req.params.slotId
          );
          response.status = "SUCCESS";
        } else if (req.params.slotType === "SPECIAL") {
          response.data = await professionistService.getMerchantSpecialSlot(
            req.params.professionistAccountId,
            req.params.slotId
          );
          response.status = "SUCCESS";
        } else throw new Error("Slot Type is required");
      } else throw new Error("Professionist AccountId id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  getStylistList: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      response.data = await professionistService.getStylistList(userId);
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
  updateProfessionistPermissions: async (req, res, next) => {
    let response = {};
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      await professionistService.updateProfessionistPermissions(
        req.params.professionistId,
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
  getProfessionistPermissions: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      if (req.params.professionistId) {
        response.data = await professionistService.getProfessionistPermissions(
          req.params.professionistId
        );
        response.status = "SUCCESS";
      } else throw new Error("Professionist Id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
