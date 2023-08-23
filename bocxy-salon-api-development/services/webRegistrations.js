const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "local"]
);
const model = require("../models/webRegistrations");

exports.insertRegistration = (insertData, dateTime) =>
  knex(model.table).insert(
    Object.assign(model.checkFields(insertData, false), {
      created_at: dateTime,
    })
  );
