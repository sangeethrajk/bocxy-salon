// Update with your config settings.
module.exports = {
  local: {
    client: "mysql2",
    connection: {
      // host: "dev.bocxy.com",
      // user: "remoteUser",
      // password: "9T97PRB7Ud+DV^FH8^f2smC^veZ^Ur",
      host: "localhost",
      user: "root",
      password: "yazhini1998@",
      database: "bocxy",
      connectTimeout: 20000,
      acquireTimeout: 20000,
      ping: function (conn, cb) {
        conn.query("SELECT 1", cb);
      },
      debug: ["ComQueryPacket"],
    },
  },

  development: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "user",
      password: "mXCZWbj2Q=_Y!f@eyFU?",
      database: "bocxy",
      connectTimeout: 20000,
      acquireTimeout: 20000,
    },
    pool: {
      min: 0,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  production: {
    client: "mysql",
    connection: {
      host: "localhost",
      user: "user",
      password: "NL**6J^f9_K?8%%UM!4p",
      database: "bocxy",
      connectTimeout: 20000,
      acquireTimeout: 20000,
    },
    pool: {
      min: 0,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
