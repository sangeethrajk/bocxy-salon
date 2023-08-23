const customerAppointmentService = require("../services/customerAppointments");

module.exports = {
  getCustomerAppointments: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      let userId =
        req.user.type === "ADMIN" ? req.user.adminId : req.user.accountId;
      // const pagination = req.query.pagination;
      // delete req.query.pagination;
      // let pageNo = req.query.page || 1;
      // delete req.query.page;
      const sort = req.query.sort;
      delete req.query.sort;
      let serviceData = {
        search: req.query || {},
      };
      if (sort) serviceData.sort = sort;
      // if (pagination) {
      //   const perPage = 5;
      //   let dbCount = await customerAppointmentService.getCustomerAppointmentsCount(
      //     userId,
      //     serviceData
      //   );
      //   if (dbCount.length) {
      //     const totalCount = dbCount[0].count;
      //     const totalPages = Math.ceil(totalCount / perPage);
      //     serviceData.start = perPage * (Number(pageNo) - 1);
      //     serviceData.end = perPage;
      //     response.perPage = perPage;
      //     response.totalPages = totalPages;
      //     response.totalCount = totalCount;
      //   }
      // }
      const appointments = await customerAppointmentService.getCustomerAppointments(
        userId,
        serviceData
      );
      const cancelledAppointments = await customerAppointmentService.getCustomerCancelledAppointments(
        userId,
        serviceData
      );
      const allAppointments = appointments.concat(cancelledAppointments);
      allAppointments.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      response.data = allAppointments;
      response.status = "SUCCESS";
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },

  getOneCustomerAppointment: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.appointmentId) {
        response.data = await customerAppointmentService.getOneCustomerAppointment(
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
};
