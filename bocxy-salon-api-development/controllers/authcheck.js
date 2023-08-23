const { includes } = require("core-js/fn/array");
const accountsService = require("../services/accounts");
const permissionsService = require("../services/permissions");

module.exports = {
  admin: (req, res, next) => {
    if (req.user) {
      if (req.user.type === "ADMIN") {
        next();
      } else {
        res.status(401).json({ status: "FAILED", data: "Invalid Token" });
      }
    } else {
      res.status(401).json({ status: "FAILED", data: "Invalid Token" });
    }
  },
  user: (req, res, next) => {
    if (req.user) {
      if (req.user.type === "USER") {
        next();
      } else {
        res.status(401).json({ status: "FAILED", data: "Invalid Token" });
      }
    } else {
      res.status(401).json({ status: "FAILED", data: "Invalid Token" });
    }
  },
  merchant: (req, res, next) => {
    if (req.user) {
      if (req.user.type === "MERCHANT") {
        next();
      } else {
        res.status(401).json({ status: "FAILED", data: "Invalid Token" });
      }
    } else {
      res.status(401).json({ status: "FAILED", data: "Invalid Token" });
    }
  },
  merchantOrAdmin: (req, res, next) => {
    if (req.user) {
      if (req.user.type === "ADMIN") {
        req.canAccess = true;
        next();
      } else if (req.user.type === "MERCHANT") {
        req.canAccess = false;
        next();
      } else {
        res.status(401).json({ status: "FAILED", data: "Invalid Token" });
      }
    } else {
      res.status(401).json({ status: "FAILED", data: "Invalid Token" });
    }
  },
  merchantOrUser: (req, res, next) => {
    if (req.user) {
      if (req.user.type === "MERCHANT" || req.user.type === "USER") {
        next();
      } else {
        res.status(401).json({ status: "FAILED", data: "Invalid Token" });
      }
    } else {
      res.status(401).json({ status: "FAILED", data: "Invalid Token" });
    }
  },
  any: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ status: "FAILED", data: "Invalid Token" });
    }
  },
  permissionsAuth: (permissions) => {
    return async function (req, res, next) {
      if (!req.canAccess) {
        let accountRoles = await accountsService.getAccountRole(
          req.user.accountId
        );
        if (accountRoles.length) {
          if (accountRoles[0].roleCodes.includes("MR")) {
            next();
          } else {
            let accountPermissions = await permissionsService.getAccountPermissions(
              req.user.accountId
            );
            if (
              accountPermissions.length &&
              accountPermissions[0].permissions.some((p) =>
                permissions.includes(p)
              )
            ) {
              next();
            } else {
              res.status(401).json({ status: "FAILED", data: "Invalid Token" });
            }
          }
        } else {
          res.status(401).json({ status: "FAILED", data: "Invalid Token" });
        }
      } else if (req.canAccess) {
        next();
      } else {
        res.status(401).json({ status: "FAILED", data: "Invalid Token" });
      }
    };
  },
};
