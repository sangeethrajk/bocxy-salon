const MongoClient = require("mongodb").MongoClient;
const f = require("util").format;

let dbConnect;

exports.mongoConnect = (user, pass, host, port, auth, db) => {
  const DBuser = encodeURIComponent(user);
  const DBpassword = encodeURIComponent(pass);
  const hostName = host;
  const portNum = port;
  const DBauthMechanism = auth;
  const dbName = db;
  let client;

  // Connection URL
  const url = f(
    "mongodb://%s:%s@%s:%s/?authMechanism=%s",
    DBuser,
    DBpassword,
    hostName,
    portNum,
    DBauthMechanism
  );

  client = new MongoClient(url, { useNewUrlParser: true });
  client
    .connect()
    .then((_) => {
      dbConnect = client.db(dbName);
      console.log(`Connected to mongoDB database: ${dbName}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.db = () => {
  try {
    if (dbConnect) return dbConnect;
    else throw new Error("Database not connected");
  } catch (err) {
    console.log(err);
    return false;
  }
};
