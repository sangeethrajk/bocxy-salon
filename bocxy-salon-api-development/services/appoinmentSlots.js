const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const accountsService = require("./accounts");
const professionistService = require("./professionist");
const merchantService = require("./merchantServices");
const merchantSlotsService = require("./merchantSlots");
const registerService = require("./register");
const moment = require("moment");
const appointmentsModel = require("../models/appointments");
const appointmentSlotsModel = require("../models/appointmentSlots");
const appointmentBookedServicesModel = require("../models/appointmentBookedServices");
const appointmentsCanceledModel = require("../models/appointmentsCanceled");
const appointmentCanceledServicesModel = require("../models/appointmentCanceledServices");
const merchantCustomersModel = require("../models/merchantCustomers");
const { now } = require("core-js/fn/date");
const knexnest = require("knexnest");
const merchantStoreServiceGradeMapsModel = require("../models/merchantStoreServiceGradeMaps");
const merchantSpecialSlotsService = require("./merchantSpecialSlots");
const annoucementService = require("./announcement");
const merchantNotificationModel = require("../models/merchantNotification");
const customerNotificationsModel = require("../models/customerNotification");
const { array } = require("nested-knex");
const merchantNotificationService = require("../services/merchantNotification");
const { of } = require("core-js/fn/array");
const commonService = require("./common");
const merchantStoreServicesModel = require("../models/merchantStoreServices");

exports.slotGroupList = () => {
  try {
    return knex
      .select(
        "slot_group_id as slotGroupId",
        "name as name",
        "interval AS minutes"
      )
      .from("m_slot_groups")
      .where("active", "Y");
  } catch (error) {
    console.log("slotGroupList failed" + error);
    throw Error(error);
  }
};

exports.getAppointmentSlots = async (
  merchantId,
  userType,
  appoimentDate,
  merchantStoreServiceId
) => {
  try {
    let merchantStoreId;

    if (userType === "USER") {
      let merchantData = await merchantService.getMerchantService(
        merchantStoreServiceId
      );
      if (merchantData.length) {
        merchantStoreId = merchantData[0].merchantStoreId;
      }
    } else {
      merchantStoreId = await accountsService.getMerchantStoreId(merchantId);
    }
    let responseSlot = [];
    let slotType = null,
      slotId = null,
      weekdayFlag = null;
    if (merchantStoreId) {
      slotId = await exports.getMerchantSpecialSlotIdByDate(
        merchantStoreId,
        appoimentDate
      );
      if (slotId) {
        const responseSplSlot = await merchantSpecialSlotsService.getAllMerchantSpecialSlots(
          slotId
        );
        responseSlot = responseSplSlot.length > 0 ? responseSplSlot[0] : {};
        slotType = responseSplSlot.length > 0 ? "SPECIAL" : null;
      } else {
        slotId = await exports.getMerchantSlotIdByDate(
          merchantStoreId,
          appoimentDate
        );
        if (slotId) {
          const responseRegSlot = await merchantSlotsService.getAllmerchantSlots(
            slotId,
            appoimentDate
          );
          responseSlot = responseRegSlot.length > 0 ? responseRegSlot[0] : {};
          slotType = responseRegSlot.length > 0 ? "REGULAR" : null;

          const slotData = await knex
            .select("ms.weekday_flag as weekdayFlag")
            .from("m_merchant_slots as ms")
            .where("ms.merchant_slot_id", slotId);
          weekdayFlag = slotData.length > 0 ? slotData[0].weekdayFlag : null;
        } else throw new Error("Slots are not exists for given date");
      }

      let stylistList = [];
      let merchantStoreServiceGradeMaps = await exports.getMerchantStoreServiceGradeMaps(
        merchantStoreServiceId
      );
      let professionistGradeIds = merchantStoreServiceGradeMaps.map(
        (p) => p.professionistGradeId
      );

      let selectStylistsQuery = knex
        .select(
          "ac.account_id as professionistAccountId",
          "ap.first_name as firstName"
        )
        .from("m_professionist_maps as pm")
        .join("m_accounts as ac", "ac.account_id", "=", "pm.account_id")
        .join("m_account_profiles as ap", "ap.account_id", "=", "pm.account_id")
        .where("pm.merchant_store_id ", merchantStoreId)
        .whereIn("pm.professionist_grade_id", professionistGradeIds)
        .andWhere("ac.active", "Y");

      stylistList = await selectStylistsQuery;

      if (slotType === "REGULAR" && weekdayFlag === "Y") {
        stylistList = await exports.sliceStylistTheyAreInLeave(
          stylistList,
          slotId,
          appoimentDate
        );
      }
      responseSlot.stylists = stylistList;
      return responseSlot;
    } else throw new Error("Store not exists");
  } catch (error) {
    console.log("getAppointmentSlots failed" + error);
    throw Error(error);
  }
};

exports.getMerchantSlotIdByDate = async (merchantStoreId, appoimentDate) => {
  try {
    let merchantSlots = await accountsService.getMerchantSlotsByMerchantStoreId(
      merchantStoreId
    );
    if (merchantSlots.length) {
      let startDate, endDate;
      let inputDate = moment(appoimentDate).format("YYYY-MM-DD");
      for (let element of merchantSlots) {
        startDate = moment(element.startDate).format("YYYY-MM-DD");
        if (element.endDate != null) {
          endDate = moment(element.endDate).format("YYYY-MM-DD");
          if (
            moment(inputDate).isBetween(startDate, endDate, undefined, "[]")
          ) {
            console.log(element.merchantSlotId, "000000000");
            return element.merchantSlotId;
          }
        } else if (moment(inputDate).isSameOrAfter(startDate)) {
          return element.merchantSlotId;
        }
      }
    } else throw new Error("Merchant Slots not exists");
  } catch (error) {
    console.log("getMerchantSlotIdByDate failed" + error);
    throw Error(error);
  }
};

exports.getMerchantSpecialSlotIdByDate = async (
  merchantStoreId,
  appoimentDate
) => {
  try {
    let merchantSpecialSlots = await accountsService.getMerchantSpecialSlotsByMerchantStoreId(
      merchantStoreId
    );
    if (merchantSpecialSlots.length) {
      let startDate, endDate;
      let inputDate = moment(appoimentDate).format("YYYY-MM-DD");
      for (let element of merchantSpecialSlots) {
        startDate = moment(element.startDate).format("YYYY-MM-DD");
        if (element.endDate != null) {
          endDate = moment(element.endDate).format("YYYY-MM-DD");
          if (
            moment(inputDate).isBetween(startDate, endDate, undefined, "[]")
          ) {
            return element.merchantSpecialSlotId;
          }
        } else if (moment(inputDate).isSameOrAfter(startDate)) {
          return element.merchantSpecialSlotId;
        }
      }
    } else return null;
  } catch (error) {
    console.log("getMerchantSpecialSlotIdByDate failed" + error);
    throw Error(error);
  }
};

exports.getAppointmentStylistSlots = async (
  merchantId,
  stylistAccountId,
  date,
  merchantStoreServiceId,
  userType
) => {
  try {
    let merchantStoreId;
    if (userType === "USER") {
      let merchantData = await merchantService.getMerchantService(
        merchantStoreServiceId
      );
      if (merchantData.length) {
        merchantStoreId = merchantData[0].merchantStoreId;
      }
    } else {
      merchantStoreId = await accountsService.getMerchantStoreId(merchantId);
    }
    let stylistSlots;
    let appoinmentSlotsData;
    if (merchantStoreId) {
      let merchantSpecialSlotId = await exports.getMerchantSpecialSlotIdByDate(
        merchantStoreId,
        date
      );
      let merchantSlotId;
      if (!merchantSpecialSlotId)
        merchantSlotId = await exports.getMerchantSlotIdByDate(
          merchantStoreId,
          date
        );
      if (stylistAccountId && Number(stylistAccountId) > 0) {
        if (merchantSpecialSlotId) {
          stylistSlots = await professionistService.getMerchantProfessionistSlotsForBooking(
            stylistAccountId,
            merchantSpecialSlotId,
            date,
            "SPECIAL"
          );
        } else {
          stylistSlots = await professionistService.getMerchantProfessionistSlotsForBooking(
            stylistAccountId,
            merchantSlotId,
            date,
            "REGULAR"
          );
        }
        appoinmentSlotsData = await professionistService.getProfessionistAppoinmentSlots(
          merchantStoreId,
          [stylistAccountId],
          date
        );
        return { bookedSlots: appoinmentSlotsData, availability: stylistSlots };
      } else {
        let stylistAccounts = await professionistService.getMerchantProfessionistWithSlots(
          merchantId,
          merchantStoreServiceId,
          userType
        );
        stylistSlots = await professionistService.getAllMerchantProfessionistSlots(
          stylistAccounts.map((p) => p.accountId),
          merchantSlotId,
          date
        );
        appoinmentSlotsData = await professionistService.getProfessionistAppoinmentSlotsWithAccountId(
          merchantStoreId,
          stylistAccounts.map((p) => p.accountId),
          date
        );
        // let resultarray = [];
        // stylistSlots.forEach((element) => {
        //   if (
        //     !appoinmentSlotsData.some(
        //       (p) =>
        //         p.accountId === element.accountId && p.slotId === element.slotId
        //     ) &&
        //     !resultarray.some((p) => p.slotId === element.slotId)
        //   ) {
        //     resultarray.push({ slotId: element.slotId });
        //   }
        // });
        return { bookedSlots: appoinmentSlotsData, availability: stylistSlots };
      }
    } else throw new Error("Store not exists");
  } catch (error) {
    console.log("getAppointmentStylistSlots failed" + error);
    throw Error(error);
  }
};

exports.getAppointmentDates = async (
  accountId,
  merchantStoreServiceId,
  userType
) => {
  try {
    let merchantStoreId;
    if (userType === "USER") {
      let merchantData = await merchantService.getMerchantService(
        merchantStoreServiceId
      );
      if (merchantData.length) {
        merchantStoreId = merchantData[0].merchantStoreId;
      }
    } else {
      merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    }
    let merchantHolidays = await merchantService.getMerchantHolidays(
      merchantStoreId
    );
    const removeDates = [];
    const days = [];
    const dateStart = moment();
    const dateEnd = moment().add(1, "month");
    while (dateEnd.diff(dateStart, "day") > 0) {
      days.push(dateStart.format("YYYY-MM-DD"));
      dateStart.add(1, "day");
    }
    merchantHolidays.forEach((element) => {
      if (element.holidayType == "PLANNED") {
        if (element.dateType == "SINGLE") {
          if (element.repeatType == "YEARLY") {
            let startDate = moment(element.startDate).format("YYYY-MM-DD");
            removeDates.push(startDate);
          } else if (element.repeatType == "WEEKLY") {
            let allWeekDays = exports.getAllWeeklyDates(element.startDay);
            Array.prototype.push.apply(removeDates, allWeekDays);
          } else if (element.repeatType == "MONTHLY") {
            removeDates.push(
              moment().date(element.startDay).format("YYYY-MM-DD")
            );
          }
        } else if (element.dateType == "MULTIPLE") {
          if (element.repeatType == "MONTHLY") {
            let startDay = element.startDay;
            let endDay = element.endDay;
            while (startDay <= endDay) {
              removeDates.push(moment().date(startDay).format("YYYY-MM-DD"));
              startDay++;
            }
          }
          if (element.repeatType == "WEEKLY") {
            let days = exports.getDaysInWeek(element.startDay, element.endDay);
            for (let day of days) {
              let allWeekDays = exports.getAllWeeklyDates(day);
              Array.prototype.push.apply(removeDates, allWeekDays);
            }
          }
          if (element.repeatType == "YEARLY") {
            let allDates = exports.getAllDates(
              element.startDate,
              element.endDate
            );
            Array.prototype.push.apply(removeDates, allDates);
          }
        }
      } else if (element.holidayType == "UNPLANNED") {
        if (element.dateType == "SINGLE") {
          let startDate = moment(element.startDate).format("YYYY-MM-DD");
          removeDates.push(startDate);
        } else if (element.dateType == "MULTIPLE") {
          let allDates = exports.getAllDates(
            element.startDate,
            element.endDate
          );
          Array.prototype.push.apply(removeDates, allDates);
        }
      }
    });

    let filteredArray = days.filter(function (x) {
      return removeDates.indexOf(x) < 0;
    });

    return filteredArray;
  } catch (error) {
    console.log("appointmentDates failed" + error);
    throw Error(error);
  }
};

exports.getAllWeeklyDates = (startDay) => {
  try {
    let removeDates = [];
    let weekDay = moment().startOf("month").day(startDay);
    if (weekDay.date() > 7 || weekDay.date() < now()) weekDay.add(7, "d");
    var month = weekDay.month();

    let i = 0;
    while (i < 5) {
      let startDateOnly = moment(weekDay).format("YYYY-MM-DD");
      removeDates.push(startDateOnly);
      weekDay.add(7, "d");
      i++;
    }
    return removeDates;
  } catch (error) {
    console.log("getAllWeeklyDates failed" + error);
    throw Error(error);
  }
};

exports.getAllDates = (startDate, endDate) => {
  try {
    let removeDates = [];
    while (new Date(endDate) >= new Date(startDate)) {
      let startDateOnly = moment(startDate).format("YYYY-MM-DD");
      removeDates.push(startDateOnly);
      startDate = new Date(startDate);
      startDate.setDate(startDate.getDate() + 1);
    }
    return removeDates;
  } catch (error) {
    console.log("getAllDates failed" + error);
    throw Error(error);
  }
};

exports.getDaysInWeek = (startDay, endDay) => {
  try {
    let days = [];
    let j;
    if (endDay < 7 && startDay > endDay) {
      j = 7;
    } else {
      j = endDay;
    }
    for (startDay; startDay <= j; startDay++) {
      days.push(startDay);
      if (startDay >= 7 && startDay != endDay) {
        startDay = 0;
        j = endDay;
      }
    }
    return days;
  } catch (error) {
    console.log("getDaysInWeek failed" + error);
    throw Error(error);
  }
};

exports.isTimeBetween = function (startTime, endTime, verifyTime) {
  let start = moment(startTime, "h:mm:ss");
  let end = moment(endTime, "h:mm:ss");
  let server = moment(verifyTime, "h:mm:ss");
  if (end < start) {
    return (
      (server >= start && server <= moment("23:59:59", "h:mm:ss")) ||
      (server >= moment("0:00:00", "h:mm:ss") && server < end)
    );
  }
  return server >= start && server < end;
};

exports.createAppointment = async (reqBody, userId, userType) => {
  try {
    let appoinmentSlotsData;
    let accountId;
    if (reqBody.type != "SPECIAL") {
      if (
        reqBody.stylistAccountId &&
        reqBody.stylistAccountId != null &&
        reqBody.stylistAccountId > 0
      ) {
        appoinmentSlotsData = await exports.getAppointmentStylistSlots(
          userId,
          reqBody.stylistAccountId,
          reqBody.bookingDate,
          reqBody.merchantStoreServiceId,
          userType
        );
      } else {
        appoinmentSlotsData = await exports.getAppointmentStylistSlots(
          userId,
          null,
          reqBody.bookingDate,
          reqBody.merchantStoreServiceId,
          userType
        );
      }
    }
    let bookingId;

    let appoinmentAlreadyBooked = false;
    if (appoinmentSlotsData && appoinmentSlotsData.length) {
      for (const time of appoinmentSlotsData) {
        appoinmentAlreadyBooked = exports.isTimeBetween(
          time.slotStartTime,
          time.slotEndTime,
          reqBody.slotStartTime
        );
        if (appoinmentAlreadyBooked) break;
        // appoinmentAlreadyBooked = exports.isTimeBetween(
        //   time.slotStartTime,
        //   time.slotEndTime,
        //   reqBody.slotEndTime
        // );
        // if (appoinmentAlreadyBooked) break;
      }
    }

    // let appoinmentSlots = appoinmentSlotsData.map((p) => p.slotId);
    if (!appoinmentAlreadyBooked) {
      let accountRow;
      if (userType == "USER") {
        accountRow = await registerService.getAccountRowByAccountId(userId);
      } else {
        accountRow = await registerService.getAccountRowWithRoleCode(
          reqBody.customerMobile,
          reqBody.customerMobileCode
        );
      }

      if (accountRow.length && accountRow[0].roleCodes.includes("CS")) {
        accountId = accountRow[0].accountId;
      }

      let merchantStoreServiceData = await merchantService.getMerchantService(
        reqBody.merchantStoreServiceId
      );

      if (merchantStoreServiceData.length) {
        let price = "";
        if (reqBody.manualPrice) {
          price = reqBody.manualPrice;
        } else {
          price = merchantStoreServiceData[0].price;
        }
        let booked_price = merchantStoreServiceData[0].price;
        if (merchantStoreServiceData[0].offer != null) {
          let offerStartDate = moment(
            merchantStoreServiceData[0].offerStart
          ).format("YYYY-MM-DD");
          let offerEndDate = moment(
            merchantStoreServiceData[0].offerEnd
          ).format("YYYY-MM-DD");
          let inputDate = moment(reqBody.bookingDate).format("YYYY-MM-DD");
          if (
            moment(inputDate).isBetween(
              offerStartDate,
              offerEndDate,
              undefined,
              "[]"
            )
          ) {
            if (!reqBody.manualPrice) {
              price = merchantStoreServiceData[0].offerPrice;
            }
            booked_price = merchantStoreServiceData[0].offerPrice;
          }
        }
        bookingId = "BK";
        bookingId = bookingId.concat(
          Math.floor(100000000000000000 + Math.random() * 900000000000000000)
        );
        let appointmentId = await knex(appointmentsModel.table).insert({
          customer_account_id: accountId ? accountId : null,
          customer_name:
            (userType === "USER") & accountRow.length
              ? accountRow[0].firstName
              : reqBody.customerName,
          customer_mobile:
            (userType === "USER") & accountRow.length
              ? accountRow[0].mobileNo
              : reqBody.customerMobile,
          customer_mobile_code:
            (userType === "USER") & accountRow.length
              ? accountRow[0].mobileNoDialCode
              : reqBody.customerMobileCode,
          customer_mobile_country:
            (userType === "USER") & accountRow.length
              ? accountRow[0].mobileNoCountryCode
              : reqBody.customerMobileCountry,
          booking_date: reqBody.bookingDate,
          status: userType === "USER" ? "PENDING" : "CONFIRMED",
          created_by: userId,
          created_by_type: "USER",
          total_price_expected: price,
          booking_id: bookingId,
        });

        await knex(appointmentSlotsModel.table).insert({
          type: reqBody.type,
          appointment_id: appointmentId,
          merchant_store_id: merchantStoreServiceData[0].merchantStoreId,
          booking_date: reqBody.bookingDate,
          slot_start_time: reqBody.slotStartTime,
          slot_end_time: reqBody.slotEndTime,
          professionist_account_id:
            reqBody.stylistAccountId &&
            reqBody.stylistAccountId != null &&
            reqBody.stylistAccountId > 0
              ? reqBody.stylistAccountId
              : null,
        });

        await knex(appointmentBookedServicesModel.table).insert({
          appointment_id: appointmentId,
          merchant_store_service_id: reqBody.merchantStoreServiceId,
          price: booked_price,
          professionist_account_id:
            reqBody.stylistAccountId &&
            reqBody.stylistAccountId != null &&
            reqBody.stylistAccountId > 0
              ? reqBody.stylistAccountId
              : null,
        });

        if (userType == "USER") {
          let accounts = await registerService.getMerchantProfessionistMapsByStoreId(
            merchantStoreServiceData[0].merchantStoreId
          );
          if (accounts.length) {
            let accountIds = accounts.map((p) => p.accountId);

            let customerName = accountRow.length
              ? accountRow[0].firstName
              : reqBody.customerName;
            const payload = {
              notification: {
                title: "New Appointment",
                body:
                  "Hello! You have have a new appointment request from " +
                  customerName,
                // click_action: "FCM_PLUGIN_ACTIVITY",
                sound: "default", //If you want notification sound
                icon:
                  "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/car_compact2.png",
              },
              data: {
                Type: "Appointment", //Any data to be retrieved in the notification callback
              },
            };

            let i,
              j,
              temparray,
              arrayLimit = 10;
            for (i = 0, j = accountIds.length; i < j; i += arrayLimit) {
              temparray = accountIds.slice(i, i + arrayLimit);
              await merchantNotificationService.pushNotificationToCustomerAccounts(
                temparray,
                payload
              );
            }

            let insertData = [];
            accountIds.forEach((accounId) => {
              insertData.push({
                account_id: accounId,
                type: "APPOINTMENT",
                appointment_id: appointmentId,
                read: "N",
              });
            });
            await knex(merchantNotificationModel.table).insert(insertData);
            console.log("firebasedone");
          }
        } else if (userType == "MERCHANT" && accountId) {
          let merchantStore = await merchantService.getMerchantStoreDataByStoreId(
            merchantStoreServiceData[0].merchantStoreId
          );
          let storeName = merchantStore.length ? merchantStore[0].name : "";
          const payload = {
            notification: {
              title: "Appointment Confirmed",
              body:
                "Hello! Your appointment has been confirmed by " + storeName,
              // click_action: "FCM_PLUGIN_ACTIVITY",
              sound: "default", //If you want notification sound
              icon:
                "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/car_compact2.png",
            },
            data: {
              Type: "Appointment", //Any data to be retrieved in the notification callback
            },
          };

          let accountIds = [];
          accountIds.push(accountId);
          await annoucementService.pushNotificationToAccounts(
            accountIds,
            payload
          );

          await knex(customerNotificationsModel.table).insert({
            account_id: accountId,
            type: "APPOINTMENT",
            type_data: "CONFIRMED",
            appointment_id: appointmentId,
            read: "N",
          });
        }
        return {
          bookedFlag: false,
          appointmentId: appointmentId[0],
          bookingId: bookingId,
        };
      } else throw new Error("Merchant store services not exists");
    } else return { bookedFlag: true, appointmentId: null, bookingId: null };
  } catch (error) {
    console.log("createAppointment failed" + error);
    throw Error(error);
  }
};

exports.createAppointmentServiceTemporary = async (reqBody, accountId) => {
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);

    let appoinmentSlotsData = await knex
      .select(appointmentSlotsModel.selectOneFields(knex))
      .from(appointmentSlotsModel.table + " as ac")
      .where("ac.merchant_store_id", merchantStoreId);

    if (appoinmentSlotsData && appoinmentSlotsData.length) {
      let merchantStoreServiceData = await knex
        .select(
          knex.raw(
            "CASE WHEN offer = 'Y' THEN offer_price ELSE price END AS price"
          )
        )
        .from(merchantStoreServicesModel.table)
        .where("merchant_store_service_id", reqBody.merchant_store_service_id);
      if (merchantStoreServiceData && merchantStoreServiceData.length) {
        await knex(appointmentBookedServicesModel.table).insert({
          appointment_id: reqBody.appointment_id,
          merchant_store_service_id: reqBody.merchant_store_service_id,
          professionist_account_id: reqBody.professionist_account_id,
          price: merchantStoreServiceData[0].price,
        });

        let appointmentPrice = await knex
          .select("total_price_expected")
          .from(appointmentsModel.table)
          .where("appointment_id", reqBody.appointment_id);

        let totalPriceExpected =
          merchantStoreServiceData[0].price +
          appointmentPrice[0].total_price_expected;

        await knex(appointmentsModel.table)
          .update({
            total_price_expected: totalPriceExpected,
          })
          .where(appointmentsModel.columns[0].field, reqBody.appointment_id);
        return true;
      } else throw new Error("Merchant Store not exists");
    } else throw new Error("Appoinment slots not exists");
  } catch (error) {
    console.log("createAppointmentServiceTemporary failed" + error);
    throw Error(error);
    return false;
  }
};

exports.getMerchantDashboardAppointments = async (accountId) => {
  let result = {};
  try {
    let merchantStoreId = await accountsService.getMerchantStoreId(accountId);
    if (merchantStoreId) {
      let canceledAppointmentsCount = await exports.getMerchantCanceledAppointmentsCount(
        merchantStoreId,
        {}
      );
      let newAppointmentsCount = await exports.getMerchantAppointmentsCount(
        merchantStoreId,
        "FUTURE",
        { search: { status: ["PENDING"] } }
      );
      let upcomingAppointmentsCount = await exports.getMerchantAppointmentsCount(
        merchantStoreId,
        "FUTURE",
        { search: { status: ["CONFIRMED"] } }
      );
      let walkinAppointmentCount = await exports.getMerchantAppointmentsCount(
        merchantStoreId,
        "FUTURE",
        { search: { status: ["CONFIRMED"], type: ["WALKIN", "SPECIAL"] } }
      );
      result.new = newAppointmentsCount.length
        ? newAppointmentsCount[0].count
        : 0;
      result.upcoming = upcomingAppointmentsCount.length
        ? upcomingAppointmentsCount[0].count
        : 0;
      result.walkin = walkinAppointmentCount.length
        ? walkinAppointmentCount[0].count
        : 0;
      result.canceled = canceledAppointmentsCount.length
        ? canceledAppointmentsCount[0].count
        : 0;
      return result;
    } else throw new Error("Store not exists");
  } catch (error) {
    console.log("getMerchantDashboardAppointments failed" + error);
    throw Error(error);
  }
};

exports.getMerchantCanceledAppointmentsCount = async (
  merchantStoreId,
  data = {}
) => {
  try {
    return knex
      .select(knex.raw(`COUNT(${"ac.appointment_id"}) AS count`))
      .from(appointmentsCanceledModel.table + " as ac")
      .where("ac.merchant_store_id", merchantStoreId)
      .andWhere((qb) => {
        if (data.search !== undefined)
          for (const obj of appointmentsCanceledModel.where) {
            if (data.search[obj.key])
              qb.where("ac." + obj.field, data.search[obj.key]);
          }
      });
  } catch (error) {
    console.log("getMerchantCanceledAppointmentsCount failed" + error);
    throw Error(error);
  }
};

exports.getMerchantAppointmentsCount = async (
  merchantStoreId,
  queryOrderType,
  data = {}
) => {
  try {
    let knexQuery = knex
      .select(knex.raw(`COUNT(${"at.appointment_id"}) AS count`))
      .from(appointmentsModel.table + " as at")
      .join(
        "t_appointment_slots as ast",
        "ast.appointment_id",
        "=",
        "at.appointment_id"
      )
      .where("ast.merchant_store_id", merchantStoreId)
      .andWhere((qb) => {
        if (data.search !== undefined) {
          for (const obj of appointmentsModel.where) {
            if (obj.key !== "status")
              if (data.search[obj.key])
                qb.where("at." + obj.field, data.search[obj.key]);
          }
          if (data.search.status && data.search.status.length) {
            qb.whereIn("at.status", data.search.status);
          }
          if (data.search.type && data.search.type.length) {
            qb.whereIn("ast.type", data.search.type);
          }
          if (data.search.professionistId) {
            qb.andWhere(
              "ast.professionist_account_id",
              data.search.professionistId
            );
          }
        }
      });

    // To filter Future or Past appointmets from current time
    if (queryOrderType === "FUTURE" || queryOrderType === "PAST") {
      const curDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const curDate = curDateTime.split(" ")[0],
        curTime = curDateTime.split(" ")[1];

      let timeOperator, dateOperator;
      if (queryOrderType === "FUTURE") {
        [timeOperator, dateOperator] = [">=", ">"];
        knexQuery = knexQuery.andWhere((qb) => {
          qb.where((qb) => {
            qb.where("at.booking_date", curDate);
            qb.andWhere("ast.slot_end_time", timeOperator, curTime);
          }).orWhere((qb) => {
            qb.where("at.booking_date", dateOperator, curDate);
          });
        });
      } else {
        [timeOperator, dateOperator] = ["<", "<"];
        knexQuery = knexQuery.andWhere((qb) => {
          qb.where((qb) => {
            qb.where("at.booking_date", curDate);
            qb.andWhere("ast.slot_end_time", timeOperator, curTime);
          })
            .orWhere("at.booking_date", dateOperator, curDate)
            .orWhere("at.status", "COMPLETED");
        });
      }
    }
    return knexQuery;
  } catch (error) {
    console.log("getMerchantAppointmentsCount failed" + error);
    throw Error(error);
  }
};

exports.getMerchantAppointments = async (
  merchantStoreId,
  queryOrderType,
  data = {}
) => {
  try {
    let resultData;
    let knexQuery = knex
      .select(
        "at.appointment_id as _appointmentId",
        "ast.type as _type",
        "at.customer_name as _customerName",
        knex.raw(`DATE_FORMAT(at.booking_date,'%Y-%m-%d') as _bookingDate`),
        knex.raw(
          `DATE_FORMAT(at.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
        ),
        knex.raw("CONCAT(ms.name,' - ',msc.name) as _bookedServices__name"),
        "ast.slot_start_time as _slotName",
        "at.total_price_expected as _totalPriceExpected",
        "at.status as _status",
        "mcp.first_name as _stylistName"
      )
      .from(appointmentsModel.table + " as at")
      .join(
        "t_appointment_slots as ast",
        "ast.appointment_id",
        "=",
        "at.appointment_id"
      )
      .leftJoin(
        knex.raw(
          "(SELECT appointment_id, merchant_store_service_id FROM t_appointment_booked_services WHERE appointment_booked_service_id IN (SELECT min(appointment_booked_service_id) FROM t_appointment_booked_services GROUP BY appointment_id )) as abs"
        ),
        "abs.appointment_id",
        "=",
        "at.appointment_id"
      )
      .leftJoin(
        "m_merchant_store_services as mss",
        "mss.merchant_store_service_id",
        "=",
        "abs.merchant_store_service_id"
      )
      .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
      .leftJoin(
        "m_service_categories as msc",
        "msc.service_category_id",
        "=",
        "mss.service_category_id"
      )
      .leftJoin(
        "m_account_profiles as mcp",
        "mcp.account_id",
        "=",
        "ast.professionist_account_id"
      )
      .where("ast.merchant_store_id", merchantStoreId)
      .andWhere((qb) => {
        if (data.search !== undefined) {
          for (const obj of appointmentsModel.where) {
            if (obj.key !== "status")
              if (data.search[obj.key])
                qb.where("at." + obj.field, data.search[obj.key]);
          }
          if (data.search.status && data.search.status.length) {
            qb.whereIn("at.status", data.search.status);
          }
          if (data.search.type && data.search.type.length) {
            qb.whereIn("ast.type", data.search.type);
          }
          if (data.search.professionistId) {
            qb.andWhere(
              "ast.professionist_account_id",
              data.search.professionistId
            );
          }
        }
      });

    // To filter Future or Past appointmets from current time
    if (queryOrderType === "FUTURE" || queryOrderType === "PAST") {
      const curDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const curDate = curDateTime.split(" ")[0],
        curTime = curDateTime.split(" ")[1];

      let timeOperator, dateOperator, order;
      if (queryOrderType === "FUTURE") {
        [timeOperator, dateOperator, order] = [">=", ">", "asc"];
        knexQuery = knexQuery.andWhere((qb) => {
          qb.where((qb) => {
            qb.where("at.booking_date", curDate);
            qb.andWhere("ast.slot_end_time", timeOperator, curTime);
          }).orWhere((qb) => {
            qb.where("at.booking_date", dateOperator, curDate);
          });
        });
      } else {
        [timeOperator, dateOperator, order] = ["<", "<", "desc"];
        knexQuery = knexQuery.andWhere((qb) => {
          qb.where((qb) => {
            qb.where("at.booking_date", curDate);
            qb.andWhere("ast.slot_end_time", timeOperator, curTime);
          })
            .orWhere("at.booking_date", dateOperator, curDate)
            .orWhere("at.status", "COMPLETED");
        });
      }
      knexQuery = knexQuery.orderBy([
        { column: "at.booking_date", order },
        { column: "ast.slot_end_time", order },
      ]);
    } else {
      // Else dynamic order_by will work
      if (data.sort === undefined) {
        knexQuery = knexQuery.orderBy("at.created_at", "desc");
      } else {
        let [column, order] = data.sort.split(":");
        const found = appointmentSlotsModel.sort.find((x) => x.key === column);
        if (!found) throw new Error('Invalid "sort" field');
        column = found.field;

        if (order === undefined) order = "asc";

        if (order !== "asc" && order !== "desc")
          throw new Error('Invalid "sort" order');

        knexQuery = knexQuery.orderBy(column, order);
      }
    }
    if (data.end) knexQuery = knexQuery.limit(data.end);
    if (data.start) knexQuery = knexQuery.offset(data.start);

    const awaitedData = await knexQuery;
    resultData = commonService.knexnest(awaitedData, "appointmentId");
    console.log(resultData);
    return resultData ? resultData : [];
  } catch (error) {
    console.log("getMerchantAppointments failed" + error);
    throw Error(error);
  }
};

exports.getMerchantCanceledAppointments = async (
  merchantStoreId,
  data = {}
) => {
  try {
    let knexQuery = knex
      .select(
        "ac.appointment_id as _appointmentId",
        "ac.type as _type",
        "ac.customer_name as _customerName",
        knex.raw(`DATE_FORMAT(ac.booking_date,'%Y-%m-%d') as _bookingDate`),
        knex.raw(
          `DATE_FORMAT(ac.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
        ),
        knex.raw(
          `DATE_FORMAT(ac.canceled_at,'%Y-%m-%d %H:%i:%s') as _canceledAt`
        ),
        knex.raw("CONCAT(ms.name,' - ',msc.name) as _canceledServices__name"),
        "ac.slot_start_time as _slotName",
        "ac.total_price_expected as _totalPriceExpected",
        "mcp.first_name as _stylistName"
      )
      .from(appointmentsCanceledModel.table + " as ac")
      .leftJoin(
        "t_appointment_canceled_services as acs",
        "acs.appointment_id",
        "=",
        "ac.appointment_id"
      )
      .leftJoin(
        "m_merchant_store_services as mss",
        "mss.merchant_store_service_id",
        "=",
        "acs.merchant_store_service_id"
      )
      .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
      .leftJoin(
        "m_service_categories as msc",
        "msc.service_category_id",
        "=",
        "mss.service_category_id"
      )
      .join(
        "m_account_profiles as mcp",
        "mcp.account_id",
        "=",
        "ac.professionist_account_id"
      )
      .where("ac.merchant_store_id", merchantStoreId)
      .andWhere((qb) => {
        if (data.search !== undefined) {
          for (const obj of appointmentsCanceledModel.where) {
            if (data.search[obj.key])
              qb.where("ac." + obj.field, data.search[obj.key]);
          }
        }
      });

    if (data.sort === undefined) {
      knexQuery = knexQuery.orderBy("ac.created_at", "desc");
    } else {
      let [column, order] = data.sort.split(":");
      const found = appointmentsCanceledModel.sort.find(
        (x) => x.key === column
      );
      if (!found) throw new Error('Invalid "sort" field');
      column = found.field;

      if (order === undefined) order = "asc";

      if (order !== "asc" && order !== "desc")
        throw new Error('Invalid "sort" order');

      knexQuery = knexQuery.orderBy("ac." + column, order);
    }
    if (data.end) knexQuery = knexQuery.limit(data.end);
    if (data.start) knexQuery = knexQuery.offset(data.start);

    await knexnest(knexQuery).then(function (data) {
      resultData = data;
    });

    return resultData ? resultData : [];
  } catch (error) {
    console.log("getMerchantCanceledAppointments failed" + error);
    throw Error(error);
  }
};

exports.updateAppointmentStatus = async (reqBody, modifiedBy, type) => {
  try {
    console.log(reqBody);
    let bodyContent;
    let bodyType;
    let accountIds = [];
    let appointmentId = reqBody.appointmentId;
    let notficationsAppointmentData = await exports.getAppointments(
      appointmentId
    );
    if (appointmentId) {
      if (reqBody.status === "CONFIRMED" || reqBody.status === "CHECKIN") {
        console.log("CONFIRMED");
        await knex(appointmentsModel.table)
          .update({
            status: reqBody.status,
            updated_by: modifiedBy,
            updated_by_type: type,
          })
          .where(appointmentsModel.columns[0].field, appointmentId);
      } else if (reqBody.status == "CANCELED") {
        let appointmentData = notficationsAppointmentData;
        let appointmentSlotsData = await exports.getAppointmentSlotsByAppointmentId(
          appointmentId
        );
        let appointmentBookedServices = await exports.getAppointmentBookedServices(
          appointmentId
        );
        if (appointmentData.length) {
          appointmentData = appointmentData[0];

          if (appointmentSlotsData.length) {
            appointmentSlotsData = appointmentSlotsData[0];

            if (appointmentBookedServices.length) {
              appointmentBookedServices = appointmentBookedServices;
              await exports.insertAppointmentsCanceled(
                appointmentData,
                appointmentSlotsData,
                reqBody.cancelReason,
                modifiedBy,
                type
              );

              await exports.insertAppointmentCanceledServices(
                appointmentBookedServices
              );

              await knex(appointmentSlotsModel.table)
                .where(appointmentSlotsModel.columns[0].field, appointmentId)
                .del();

              await knex(appointmentBookedServicesModel.table)
                .where(
                  appointmentBookedServicesModel.columns[1].field,
                  appointmentId
                )
                .del();

              await knex(appointmentsModel.table)
                .where(appointmentsModel.columns[0].field, appointmentId)
                .del();
            }
          }
        }
      } else if (reqBody.status === "COMPLETED") {
        await knex(appointmentsModel.table)
          .update({
            status: reqBody.status,
            updated_by: modifiedBy,
            updated_by_type: type,
          })
          .where(appointmentsModel.columns[0].field, appointmentId);

        let appointmentData = notficationsAppointmentData;

        if (appointmentData.length && appointmentData[0].customerAccountId) {
          let appointmentSlotsData = await exports.getAppointmentSlotsByAppointmentId(
            appointmentId
          );

          if (appointmentSlotsData.length) {
            let merchantCustomersData = await exports.getMerchantCustomers(
              appointmentSlotsData[0].merchantStoreId,
              appointmentData[0].customerAccountId
            );

            if (!merchantCustomersData.length) {
              await knex(merchantCustomersModel.table).insert({
                merchant_store_id: appointmentSlotsData[0].merchantStoreId,
                customer_id: appointmentData[0].customerAccountId,
                visit_count: 1,
              });
            } else {
              await knex(merchantCustomersModel.table)
                .update({
                  visit_count: knex.raw("visit_count + 1"),
                })
                .where(
                  merchantCustomersModel.columns[0].field,
                  appointmentSlotsData[0].merchantStoreId
                )
                .andWhere(
                  merchantCustomersModel.columns[1].field,
                  appointmentData[0].customerAccountId
                );
            }
          }
        }
      }

      if (notficationsAppointmentData[0].customerAccountId) {
        let merchantStore = await merchantService.getMerchantStoreDataByStoreId(
          modifiedBy
        );
        let storeName = merchantStore.length ? merchantStore[0].name : "";

        if (reqBody.status === "CONFIRMED") {
          bodyType = "Appointment Confirmed";
          bodyContent =
            "Hello! Your appointment has been confirmed by " + storeName;
        } else if (reqBody.status == "COMPLETED") {
          bodyType = "Appointment Completed";
          bodyContent =
            "Thank you for choosing our service, please feel free to rate us. -" +
            storeName;
        } else if (reqBody.status == "CANCELED") {
          if (reqBody.cancelReason && reqBody.cancelReason !== null) {
            bodyContent =
              "Oops! " +
              storeName +
              " apologies for this cancellation. " +
              reqBody.cancelReason;
          } else {
            bodyContent =
              "Oops! " + storeName + " apologies for this cancellation";
          }
          bodyType = "Appointment Canceled";
        } else if (reqBody.status == "CHECKIN") {
          bodyType = "Appointment Checked In";
          bodyContent = "You are now checked in at " + storeName;
        }

        const payload = {
          notification: {
            title: bodyType,
            body: bodyContent,
            // click_action: "FCM_PLUGIN_ACTIVITY",
            sound: "default", //If you want notification sound
            icon:
              "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/car_compact2.png",
          },
          data: {
            Type: "Appointment", //Any data to be retrieved in the notification callback
          },
        };
        console.log(reqBody.status, "STATUS");
        accountIds.push(notficationsAppointmentData[0].customerAccountId);
        await annoucementService.pushNotificationToAccounts(
          accountIds,
          payload
        );

        await knex(customerNotificationsModel.table).insert({
          account_id: notficationsAppointmentData[0].customerAccountId,
          type: "APPOINTMENT",
          type_data: reqBody.status,
          appointment_id: appointmentId,
          read: "N",
        });
      }
    }
  } catch (error) {
    console.log("updateAppointmentStatus failed" + error);
    throw Error(error);
  }
};

exports.getAppointments = (appointmentId) => {
  try {
    return knex
      .select(...appointmentsModel.selectOneFields(knex))
      .from(appointmentsModel.table)
      .where(appointmentsModel.columns[0].field, appointmentId);
  } catch (error) {
    console.log("getAppointments failed" + error);
    throw Error(error);
  }
};

exports.getAppointmentBookedServices = (appointmentId) => {
  try {
    return knex
      .select(...appointmentBookedServicesModel.selectOneFields(knex))
      .from(appointmentBookedServicesModel.table)
      .where(appointmentBookedServicesModel.columns[1].field, appointmentId);
  } catch (error) {
    console.log("getAppointmentBookedServices failed" + error);
    throw Error(error);
  }
};

exports.insertAppointmentsCanceled = (
  appointmentData,
  appointmentSlotsData,
  cancelReason,
  canceledBy,
  type
) => {
  try {
    return knex(appointmentsCanceledModel.table).insert(
      Object.assign(
        appointmentsCanceledModel.checkFields(appointmentData, true),
        {
          merchant_store_id: appointmentSlotsData.merchantStoreId,
          type: appointmentSlotsData.type,
          professionist_account_id: appointmentSlotsData.professionistAccountId,
          cancel_reason: cancelReason,
          canceled_by: canceledBy,
          canceled_by_type: type,
          slot_start_time: appointmentSlotsData.slotStartTime,
          slot_end_time: appointmentSlotsData.slotEndTime,
          total_price_expected: appointmentData.totalPriceExpected,
          reschedule_count: appointmentData.rescheduleCount,
        }
      )
    );
  } catch (error) {
    console.log("insertAppointmentsCanceled failed" + error);
    throw Error(error);
  }
};

exports.insertAppointmentCanceledServices = (appointmentCanceledServices) => {
  try {
    const insertData = appointmentCanceledServices.map((x) =>
      appointmentCanceledServicesModel.checkFields(x, true)
    );
    return knex(appointmentCanceledServicesModel.table).insert(insertData);
  } catch (error) {
    console.log("insertAppointmentCanceledServices failed" + error);
    throw Error(error);
  }
};

exports.getMerchantCustomers = (storeId, customerId) => {
  try {
    return knex
      .select(...merchantCustomersModel.selectOneFields(knex))
      .from(merchantCustomersModel.table)
      .where(merchantCustomersModel.columns[0].field, storeId)
      .andWhere(merchantCustomersModel.columns[1].field, customerId);
  } catch (error) {
    console.log("getMerchantCustomers failed" + error);
    throw Error(error);
  }
};

exports.getAppointmentSlotsByAppointmentId = (appointmentId) => {
  try {
    return knex
      .select(...appointmentSlotsModel.selectOneFields(knex))
      .from(appointmentSlotsModel.table)
      .where(appointmentSlotsModel.columns[0].field, appointmentId);
  } catch (error) {
    console.log("getAppointmentSlotsByAppointmentId failed" + error);
    throw Error(error);
  }
};

exports.getStylistByService = async (
  merchantId,
  merchantServiceId,
  userType
) => {
  try {
    // let merchantStoreId;
    // if (userType === "USER") {
    //   let merchantData = await merchantService.getMerchantService(
    //     merchantServiceId
    //   );
    //   if (merchantData.length) {
    //     merchantStoreId = merchantData[0].merchantStoreId;
    //   }
    // } else {
    //   merchantStoreId = await accountsService.getMerchantStoreId(merchantId);
    // }
    // if (merchantStoreId) {
    // let merchantStoreServiceGradeMaps = await exports.getMerchantStoreServiceGradeMaps(
    //   merchantServiceId
    // );
    // let professionistGradeIds = merchantStoreServiceGradeMaps.map(
    //   (p) => p.professionistGradeId
    // );
    let selectQuery = knex
      .select(
        // "ap.account_id as _stylists__professionistAccountId",
        // "ap.first_name as _stylists__firstName",
        "mss.slot_duration as _slotDuration",
        knex.raw(
          "CASE WHEN offer = 'Y' THEN mss.offer_price ELSE mss.price END AS _price"
        )
      )
      .from("m_merchant_store_services as mss")
      // .join("m_account_profiles as ap", "ap.account_id", "=", "pm.account_id")
      // .join(
      //   "m_merchant_store_services as mss",
      //   "mss.merchant_store_id",
      //   "=",
      //   "pm.merchant_store_id"
      // )
      // .where("pm.merchant_store_id ", merchantStoreId)
      .where("mss.merchant_store_service_id", merchantServiceId);
    // .whereIn("pm.professionist_grade_id", professionistGradeIds);

    await knexnest(selectQuery).then(function (data) {
      resultData = data && data.length ? data[0] : {};
    });

    return resultData ? resultData : {};
    // } else throw new Error("Store not exists");
  } catch (error) {
    console.log("getStylistByService failed" + error);
    throw Error(error);
  }
};

exports.getMerchantStoreServiceGradeMaps = (merchantServiceId) => {
  try {
    return knex
      .select(...merchantStoreServiceGradeMapsModel.selectOneFields(knex))
      .from(merchantStoreServiceGradeMapsModel.table)
      .where(
        merchantStoreServiceGradeMapsModel.columns[0].field,
        merchantServiceId
      );
  } catch (error) {
    console.log("getMerchantStoreServiceGradeMaps failed" + error);
    throw Error(error);
  }
};

exports.getMerchantOngoingAppointmentsCount = async (
  merchantStoreId,
  data = {}
) => {
  try {
    let knexQuery = knex
      .select(knex.raw(`COUNT(${"at.appointment_id"}) AS count`))
      .from(appointmentsModel.table + " as at")
      .join(
        "t_appointment_slots as ast",
        "ast.appointment_id",
        "=",
        "at.appointment_id"
      )
      .where("ast.merchant_store_id", merchantStoreId)
      .andWhere((qb) => {
        if (data.search !== undefined) {
          for (const obj of appointmentsModel.where) {
            if (obj.key !== "status")
              if (data.search[obj.key])
                qb.where("at." + obj.field, data.search[obj.key]);
          }
          if (data.search.status && data.search.status.length) {
            qb.whereIn("at.status", data.search.status);
          }
          if (data.search.professionistId) {
            qb.andWhere(
              "ast.professionist_account_id",
              data.search.professionistId
            );
          }

          const curDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
          const curDate = curDateTime.split(" ")[0],
            curTime = curDateTime.split(" ")[1];
          const timeOperator = ">=";
          qb.andWhere("at.booking_date", curDate);
          qb.andWhere("ast.slot_end_time", timeOperator, curTime);
        }
      });

    return knexQuery;
  } catch (error) {
    console.log("getMerchantOngoingAppointmentsCount failed" + error);
    throw Error(error);
  }
};

exports.getMerchantOngoingAppointments = async (merchantStoreId, data = {}) => {
  try {
    let knexQuery = knex
      .select(
        "at.appointment_id as _appointmentId",
        "ast.type as _type",
        "at.customer_name as _customerName",
        knex.raw(`DATE_FORMAT(at.booking_date,'%Y-%m-%d') as _bookingDate`),
        knex.raw("CONCAT(ms.name,' - ',msc.name) as _bookedServices__name"),
        "ast.slot_start_time as _slotStartTime",
        "ast.slot_end_time as _slotEndTime",
        "at.total_price_expected as _totalPriceExpected",
        "at.status as _status",
        "mcp.first_name as _stylistName"
      )
      .from(appointmentsModel.table + " as at")
      .join(
        "t_appointment_slots as ast",
        "ast.appointment_id",
        "=",
        "at.appointment_id"
      )
      .leftJoin(
        knex.raw(
          "(SELECT appointment_id, merchant_store_service_id FROM t_appointment_booked_services WHERE appointment_booked_service_id IN (SELECT min(appointment_booked_service_id) FROM t_appointment_booked_services GROUP BY appointment_id )) as abs"
        ),
        "abs.appointment_id",
        "=",
        "at.appointment_id"
      )
      .leftJoin(
        "m_merchant_store_services as mss",
        "mss.merchant_store_service_id",
        "=",
        "abs.merchant_store_service_id"
      )
      .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
      .leftJoin(
        "m_service_categories as msc",
        "msc.service_category_id",
        "=",
        "mss.service_category_id"
      )
      .leftJoin(
        "m_account_profiles as mcp",
        "mcp.account_id",
        "=",
        "ast.professionist_account_id"
      )
      .where("ast.merchant_store_id", merchantStoreId)
      .andWhere((qb) => {
        if (data.search !== undefined) {
          for (const obj of appointmentsModel.where) {
            if (obj.key !== "status")
              if (data.search[obj.key])
                qb.where("at." + obj.field, data.search[obj.key]);
          }
          if (data.search.status && data.search.status.length) {
            qb.whereIn("at.status", data.search.status);
          }
          if (data.search.professionistId) {
            qb.andWhere(
              "ast.professionist_account_id",
              data.search.professionistId
            );
          }

          const curDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
          const curDate = curDateTime.split(" ")[0],
            curTime = curDateTime.split(" ")[1];
          const timeOperator = ">=";
          qb.andWhere("at.booking_date", curDate);
          qb.andWhere("ast.slot_end_time", timeOperator, curTime);
        }
      })
      .orderBy([
        { column: "at.booking_date", order: "ASC" },
        { column: "ast.slot_end_time", order: "ASC" },
      ]);

    if (data.end) knexQuery = knexQuery.limit(data.end);
    if (data.start) knexQuery = knexQuery.offset(data.start);

    await knexnest(knexQuery).then(function (data) {
      resultData = data;
    });

    return resultData ? resultData : [];
  } catch (error) {
    console.log("getMerchantOngoingAppointments failed" + error);
    throw Error(error);
  }
};

exports.getOneMerchantAppointment = async (appointment_id) => {
  try {
    let resultData = [];
    let knexQuery;
    const checkCancel = await knex
      .select(knex.raw("COUNT(appointment_id) as count"))
      .from(appointmentsModel.table + " as at")
      .where("at.appointment_id", appointment_id);
    if (checkCancel.length && checkCancel[0].count) {
      knexQuery = await knex
        .select(
          "at.appointment_id as _appointmentId",
          "at.booking_id as _bookingId",
          "at.customer_name as _customerName",
          knex.raw(
            "CONCAT(at.customer_mobile_code,'  ',at.customer_mobile) as _customerMobile"
          ),
          knex.raw("CONCAT(ms.name,' - ',msc.name) as _bookedServices__name"),
          "mcs.first_name as _bookedServices__stylist",
          "abs.price as _bookedServices__price",
          "mss.duration as _bookedServices__duration",
          "ast.slot_start_time as _slotName",
          "ast.type as _type",
          knex.raw(`DATE_FORMAT(at.booking_date,'%Y-%m-%d') as _bookingDate`),
          knex.raw(
            `DATE_FORMAT(at.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
          ),
          "mcp.account_id as _professionistAccountId",
          "mcp.first_name as _stylistName",
          "at.total_price_expected as _totalPriceExpected",
          "at.status as _status",
          knex.raw("? as _cancelReason", [null])
        )
        .from(appointmentsModel.table + " as at")
        .join(
          "t_appointment_slots as ast",
          "ast.appointment_id",
          "=",
          "at.appointment_id"
        )
        .leftJoin(
          "t_appointment_booked_services as abs",
          "abs.appointment_id",
          "=",
          "at.appointment_id"
        )
        .leftJoin(
          "m_merchant_store_services as mss",
          "mss.merchant_store_service_id",
          "=",
          "abs.merchant_store_service_id"
        )
        .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
        .leftJoin(
          "m_service_categories as msc",
          "msc.service_category_id",
          "=",
          "mss.service_category_id"
        )
        .join(
          "m_merchant_stores as mts",
          "ast.merchant_store_id",
          "=",
          "mts.merchant_store_id"
        )
        .join(
          "m_account_profiles as mcp",
          "mcp.account_id",
          "=",
          "ast.professionist_account_id"
        )
        .leftJoin(
          "m_account_profiles as mcs",
          "mcs.account_id",
          "=",
          "abs.professionist_account_id"
        )
        .where("at.appointment_id", appointment_id);
    } else {
      knexQuery = await knex
        .select(
          "atc.appointment_id as _appointmentId",
          "atc.booking_id as _bookingId",
          "atc.customer_name as _customerName",
          knex.raw(
            "CONCAT(atc.customer_mobile_code,'  ',atc.customer_mobile) as _customerMobile"
          ),
          knex.raw("CONCAT(ms.name,' - ',msc.name) as _bookedServices__name"),
          "mcs.first_name as _bookedServices__stylist",
          "acs.price as _bookedServices__price",
          "mss.duration as _bookedServices__duration",
          "atc.slot_start_time as _slotName",
          "atc.type as _type",
          "atc.cancel_reason as _cancelReason",
          knex.raw(`DATE_FORMAT(atc.booking_date,'%Y-%m-%d') as _bookingDate`),
          knex.raw(
            `DATE_FORMAT(atc.created_at,'%Y-%m-%d %H:%i:%s') as _createdAt`
          ),
          "mcp.account_id as _professionistAccountId",
          "mcp.first_name as _stylistName",
          "atc.total_price_expected as _totalPriceExpected",
          knex.raw("? as _status", ["CANCELED"])
        )
        .from(appointmentsCanceledModel.table + " as atc")
        .leftJoin(
          "t_appointment_canceled_services as acs",
          "acs.appointment_id",
          "=",
          "atc.appointment_id"
        )
        .leftJoin(
          "m_merchant_store_services as mss",
          "mss.merchant_store_service_id",
          "=",
          "acs.merchant_store_service_id"
        )
        .leftJoin("m_services as ms", "ms.service_id", "=", "mss.service_id")
        .leftJoin(
          "m_service_categories as msc",
          "msc.service_category_id",
          "=",
          "mss.service_category_id"
        )
        .join(
          "m_merchant_stores as mts",
          "atc.merchant_store_id",
          "=",
          "mts.merchant_store_id"
        )
        .join(
          "m_account_profiles as mcp",
          "mcp.account_id",
          "=",
          "atc.professionist_account_id"
        )
        .leftJoin(
          "m_account_profiles as mcs",
          "mcs.account_id",
          "=",
          "acs.professionist_account_id"
        )
        .where("atc.appointment_id", appointment_id);
    }
    resultData = await commonService.knexnest(knexQuery, "appointmentId");

    return resultData ? resultData : [];
  } catch (error) {
    console.log("get One CustomerAppointment failed" + error);
    throw Error(error);
  }
};
exports.sliceStylistTheyAreInLeave = async (
  stylistArr,
  merchantSlotId,
  appoimentDate
) => {
  try {
    const idArr = stylistArr.map((x) => x.professionistAccountId);
    let day = Number(moment(appoimentDate).isoWeekday());
    day = day === 7 ? 1 : day + 1;
    const idsTRArr = await knex
      .select("account_id as professionistAccountId")
      .from("m_merchant_professionist_slot_weekdays")
      .where("merchant_slot_id", merchantSlotId)
      .whereIn("account_id", idArr)
      .andWhere("day", day)
      .andWhere("start_time", null)
      .andWhere("sequence", 1);
    const idsToRemove = idsTRArr.map((x) => x.professionistAccountId);
    const reponseArr = stylistArr.filter(
      (x) => !idsToRemove.includes(x.professionistAccountId)
    );
    return reponseArr;
  } catch (error) {
    console.log("getAllmerchantSlots failed" + error);
    throw Error(error);
  }
};
