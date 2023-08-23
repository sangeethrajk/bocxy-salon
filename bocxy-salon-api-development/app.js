const express = require("express");
const logger = require("morgan");
const compression = require("compression");
// let path = require('path');
// let cookieParser = require('cookie-parser'); // -- use express-session instead this
const bodyParser = require("body-parser");

// const mongoGateway = require('./mongo-gateway');

const appRoutes = require("./routes");

const app = express();

require("dotenv").config();

app.use(compression());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ limit: "200mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "200mb",
    extended: true,
    parameterLimit: 100000,
  })
);
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
  );
  console.log("Request was made to: " + req.originalUrl);
  //intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    //respond with 200
    res.sendStatus(200);
  } else {
    //move on
    next();
  }
});
appRoutes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  return res.sendStatus(404).json({ response: "page not found" });
});

module.exports = app;
