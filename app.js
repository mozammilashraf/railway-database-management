const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const databaseController = require("./controllers/databaseController");
const connection = databaseController.connection;
const sessionStore = new MySQLStore({} /* session store options */, connection);

const cors = require("cors");

var indexRouter = require("./routes/index");
var agentRouter = require("./routes/agent");
var authRouter = require("./routes/auth");
var getStartedRoute = require("./routes/getStarted");

const initializePasport = require("./passport-config");
initializePasport(passport);

// var usersRouter = require('./routes/users');

var app = express();

// ! Changes
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(flash());
app.use(
  session({
    // key: "session_cookie_name",
    secret: process.env.SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: sessionStore,
    cookie: { maxAge: 1800000 }, // 30 Minutes
  })
);
// Configure Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// app.use(passport.authenticate("session"));

app.use((req, res, next) => {
  res.locals.url = req.path;
  // console.log("Current path is " + req.path);
  // console.log("Time:", new Date().toLocaleString());
  res.locals.user = req.user;
  // console.log("User :", req.user);
  next();
});

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/agent", agentRouter);
app.use("/getStarted", getStartedRoute);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  // !Chnages
  res.render("error");
  // res.send("error");
  console.error("Error in render, Error : " + err.message);
  // console.log(err);
});

module.exports = app;
