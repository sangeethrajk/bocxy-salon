const professionistGradesService = require("../services/professionistGrades");

module.exports = {
  getProfessionistGrades: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      const pagination = req.query.pagination;
      delete req.query.pagination;
      let pageNo = req.query.page || 1;
      delete req.query.page;
      const sort = req.query.sort;
      delete req.query.sort;

      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      let serviceData = {
        search: req.query || {},
      };
      if (sort) serviceData.sort = sort;
      if (pagination) {
        const perPage = 10;
        let dbCount = await professionistGradesService.getProfessionistGradesCount(
          serviceData,
          userId
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
      response.data = await professionistGradesService.getProfessionistGrades(
        serviceData,
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
  insertProfessionistGrade: async (req, res, next) => {
    let response = {};
    response.data = [];
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      console.log(req.body);
      await professionistGradesService.insertProfessionistGrade(
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
  updateProfessionistGrade: async (req, res, next) => {
    let response = {};
    let userId =
      req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
    try {
      console.log(req.body);
      await professionistGradesService.updateProfessionistGrade(
        req.params.professionistGradeId,
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
  deleteProfessionistGrade: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      response.data = await professionistGradesService.deleteProfessionistGrade(
        req.params.professionistGradeId
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
