const merchantStoresService = require("../services/merchantStores");

module.exports = {
  getMerchantStores: async (req, res, next) => {
    let response = {};
    response.data = [];
    try {
      if (req.params.merchantStoreId) {
        response.data = await merchantStoresService.getMerchantStores(
          req.params.merchantStoreId
        );
        response.status = "SUCCESS";
        response.data = response.data[0] || {};
      } else throw new Error("merchantStoreId id is required");
    } catch (err) {
      console.log(err);
      response.status = "FAILURE";
      response.data = err;
    }
    res.status(200).json(response);
  },
};
