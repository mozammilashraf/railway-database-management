var express = require("express");
var passport = require("passport");
var crypto = require("crypto");
const dbService = require("../services/dbService");
const db = dbService.getDbServiceInstance();

var router = express.Router();

const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/agent");
  }
  return next();
};

/* POST /logout
 *
 * This route logs the user out.
 */
router.get("/agent-logout", function (req, res, next) {
  req.logout();
  req.flash("info", "You are now logged out");
  res.redirect("/");
});

router.get("/agent-login", checkNotAuthenticated, (req, res) => {
  res.render("agent-login");
});
router.get("/agent-request-login", (req, res) => {
  res.render("agent-request-login");
});

// Express Validator
const { check, validationResult } = require("express-validator");
const { body } = require("express-validator");

router.post(
  "/agent-login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successReturnToOrRedirect: "/agent",
    // successFlash: "You are now logged in",
    failureRedirect: "/agent-login",
    failureFlash: true,
    // failureFlash: "Login Failed, Please try again",
    // failureMessage: true,
  })
);

router.post("/agent-request-login", [
  // Validate Data
  check("first-name")
    .isLength({ min: 1 })
    .withMessage("First Name should be specified")
    .isString()
    .withMessage("First name must be alphanumeric"),
  check("last-name")
    .isLength({ min: 0 })
    .withMessage("Last Name should be specified")
    .isString()
    .withMessage("Last name must be alphanumeric"),
  // check("username")
  //   .isLength({ min: 6 })
  //   .withMessage("Username Should Be grater than zero")
  //   .isAlphanumeric()
  //   .withMessage("Invalid Username Address"),
  check("email").isEmail().withMessage("Invalid Email"),
  check("username")
    .isLength({ min: 6 })
    .withMessage("Username length should be grater than 6"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password length should be grater than 6"),
  check("confirm-password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password Do not match"),

  body("*").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.array() });
      // console.log(requestDatetime);
      return;
    } else {
      // res.json(req.body);
      const username = req.body.username;
      const email = req.body.email;
      const firstName = req.body["first-name"];
      const lastName = req.body["last-name"] ? req.body["last-name"] : null;
      const phoneNo = req.body["phone-number"]
        ? req.body["phone-number"]
        : null;
      const dateOfBirth = req.body["date-of-birth"]
        ? req.body["date-of-birth"]
        : null;
      const password = req.body["password"];
      // const currentDateTime = new Date();
      // const requestDatetime = `${currentDateTime.getFullYear()}-${currentDateTime.getMonth()}-${currentDateTime.getDate()} ${currentDateTime.getHours()}:${currentDateTime.getMinutes()}:${currentDateTime.getSeconds()}`;
      // const responseDatetime = null;
      const responseStatus = "pending";
      // const responseAgent = null;

      var salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        password,
        salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (err) {
            return next(err);
          }

          try {
            const query = `INSERT INTO request_agent_signup
              (email, username, first_name, last_name, phone_no, DOB, hashed_password, salt,
              response_status)
              VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const queryData = [
              email,
              username,
              firstName,
              lastName,
              phoneNo,
              dateOfBirth,
              hashedPassword,
              salt,
              responseStatus,
            ];
            const data = await db.runQuery(query, queryData);
            if (data.error) {
              res.redirect("/agent-request-login");
              console.log(data.err);
            } else res.redirect("/");
            // console.log(data.response);

            // var user = {
            //   id: this.lastID,
            //   username: req.body.email,
            // };
            // req.login(user, function (err) {
            //   if (err) {
            //     return next(err);
            //   }
            // });

            // res.json({ data: data.response, err: data.err, error: data.error });
          } catch (err) {
            // res.json({ data: {}, err: err.message, error: true });
            console.log(err);
          }
        }
      );
    }
  },
]);
router.post(
  "/agent-login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successReturnToOrRedirect: "/agent",
    // successFlash: "You are now logged in",
    failureRedirect: "/agent-login",
    failureFlash: true,
    // failureFlash: "Login Failed, Please try again",
    // failureMessage: true,
  })
);

module.exports = router;
