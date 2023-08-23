const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);

exports.getMerchantStores = async (merchantStoreId) => {
  try {
    return knex
      .select(
        "ms.name as name",
        "ms.address as address",
        "ms.location as location"
      )
      .from("m_merchant_stores as ms")
      .where("ms.merchant_store_id", merchantStoreId);
  } catch (error) {
    console.log("getMerchantStores failed" + error);
    throw Error(error);
  }
};
