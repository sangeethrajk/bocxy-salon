const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const model = require("../models/merchantCustomers");

exports.getVisitedCustomerCount = (data = {},id) =>
  knex
    .select(knex.raw(`COUNT(${model.columns[0].field}) AS count`))
    .from(model.table)
    .where((qb) => {
      if (data.search !== undefined)
        for (const obj of model.where) {
          if (data.search[obj.key]) qb.where(obj.field, data.search[obj.key]);
        }
        qb.where(`merchant_store_id`, id);
    });
    exports.getRegularCustomerCount = (data = {},id) =>
    knex
      .select(knex.raw(`COUNT(${model.columns[0].field}) AS count`))
      .from(model.table)
      .where((qb) => {
        if (data.search !== undefined)
          for (const obj of model.where) {
            if (data.search[obj.key]) qb.where(obj.field, data.search[obj.key]);
          }
          qb.where(`merchant_store_id`, id);
          qb.where('visit_count','>=',2)     
      });
    exports.getVisited = (id, data = {}) =>{
      let knexQuery = knex
      .select(          
        "a.merchant_store_id AS merchantStoreId",
        "a.customer_id AS customerId",
        "a.visit_count AS visitCount",
        "a.last_visit_time AS lastVisitTime",
        "b.mobile_no AS mobileNo",
        "c.first_name AS firstName",
        "c.last_name AS lastName",          
      )          
      .from("t_merchant_customers AS a")
      .join("m_accounts AS b", "b.account_id", "a.customer_id")
      .join("m_account_profiles AS c", "c.account_id", "a.customer_id")     
    
      .where((qb) => {
       //flag check
       qb.where(`a.merchant_store_id`, id);
        // qb.where(`c.flag`, '0');
        // qb.where(knex.raw('DATE(c.created_at) > CURDATE()'));                        
      });        
      if (data.sort === undefined) {
        knexQuery = knexQuery.orderBy(model.sort[0].field, "asc");
      } else {
        let [column, order] = data.sort.split(":");
        const found = model.sort.find((x) => x.key === column);
        if (!found) throw new Error('Invalid "sort" field');
        column = found.field;
    
        if (order === undefined) order = "asc";
    
        if (order !== "asc" && order !== "desc")
          throw new Error('Invalid "sort" order');
    
        knexQuery = knexQuery.orderBy(column, order);
      }
      if (data.end) knexQuery = knexQuery.limit(data.end);
      if (data.start) knexQuery = knexQuery.offset(data.start);
      return knexQuery;
      
    };
    exports.getRegular = (id, data = {}) =>{
      let knexQuery = knex
      .select(          
        "a.merchant_store_id AS merchantStoreId",
        "a.customer_id AS customerId",
        "a.visit_count AS visitCount",
        "a.last_visit_time AS lastVisitTime",
        "b.mobile_no AS mobileNo",
        "c.first_name AS firstName",
        "c.last_name AS lastName",    
           )          
           .from("t_merchant_customers AS a")
           .join("m_accounts AS b", "b.account_id", "a.customer_id")
           .join("m_account_profiles AS c", "c.account_id", "a.customer_id")  
    
   .where('visit_count','>=',2)     
   .where(`a.merchant_store_id`, id);
   if (data.sort === undefined) {
    knexQuery = knexQuery.orderBy(model.sort[0].field, "asc");
  } else {
    let [column, order] = data.sort.split(":");
    const found = model.sort.find((x) => x.key === column);
    if (!found) throw new Error('Invalid "sort" field');
    column = found.field;

    if (order === undefined) order = "asc";

    if (order !== "asc" && order !== "desc")
      throw new Error('Invalid "sort" order');

    knexQuery = knexQuery.orderBy(column, order);
  }
  if (data.end) knexQuery = knexQuery.limit(data.end);
  if (data.start) knexQuery = knexQuery.offset(data.start);
  return knexQuery;
    };

