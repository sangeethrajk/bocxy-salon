module.exports = {
  smsconstants: {
    smsApiUrl: "https://api.textlocal.in/send/",
    smsApiKey: "vArqHyVi01g-7XqUPOvz8qF12aOcp00bkciGHG4G8C",
    smsMessage: "This is your registration OTP, ",
    smsSender: "MAZLAN",
    smsOtpTimeOut: 300,
  },
  msg91Constants: {
    apiUrl: "https://api.msg91.com/api/v5/",
    authKey: "347483AVz0IryB5fc7c369P1",
    templateIdForOtp: "5fc53e557c68de6529358dd8",
    flowIdForLink: "5fc7ee151c3ad765d2200023",
    flowIdforApproval: "60198461a24dd663dc0bd041",
    flowIdforOnboard: "60229e8219249f6c5b77b00a",
  },
  partnerAppAndroidLink: "https://bocxy.com/partnerApp",
  partnerAppIosLink: "https://bocxy.com/iosPartnerApp",
  customerAppAndroidLink: "https://bocxy.com/app",
  customerAppIosLink: "https://bocxy.com/iosApp",
  roles: {
    userRoles: ["CS"],
    merchantRoles: ["MR", "MG", "ST"],
  },
  professionist: {
    url:
      "https://play.google.com/store/apps/details?id=com.mazelon.bocxyPartner",
  },
  permissions: {
    APPOINTMENT_BILLING: "APPOINTMENT_BILLING",
    REVENUE_STATUS: "REVENUE_STATUS",
    SERVICE_MANAGEMENT: "SERVICE_MANAGEMENT",
    STYLIST_MANAGEMENT: "STYLIST_MANAGEMENT",
    STYLIST_SLOT_CONFIGURATION: "STYLIST_SLOT_CONFIGURATION",
    BANNERS_MANAGEMENT: "BANNERS_MANAGEMENT",
    STORE_TIME_MANAGEMENT: "STORE_TIME_MANAGEMENT",
    CUSTOMER_MANAGEMENT: "CUSTOMER_MANAGEMENT",
    EXPENSE_MANAGEMENT: "EXPENSE_MANAGEMENT",
    ANNOUNCEMENT_MANAGEMENT: "ANNOUNCEMENT_MANAGEMENT",
    HOLIDAY_MANAGEMENT: "HOLIDAY_MANAGEMENT",
  },
};
