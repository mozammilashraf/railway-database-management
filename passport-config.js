// const { authenticate } = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const dbService = require("./services/dbService");
const db = dbService.getDbServiceInstance();

function initialize(passport) {
  async function getUserById(id) {
    const query1 = `SELECT agent_id AS id, email, username, first_name, last_name, 
    phone_no, DATE_FORMAT(DOB, "%d %M %Y") AS DOB, access_level FROM agent
    WHERE agent_id = ?`;
    const queryData1 = [id];
    const data = await db.runQuery(query1, queryData1);
    // return data.response[0]?.;
    // console.log(data);
    if (data.response?.length === 0) return null;
    else return data.response[0];
  }
  async function getUserByEmail(email) {
    const query1 = `SELECT agent_id AS id, email, username, first_name, last_name, 
       phone_no, DATE_FORMAT(DOB, "%d %M %Y") AS DOB, access_level FROM agent
       WHERE email = ?`;
    const queryData1 = [email];
    const data = await db.runQuery(query1, queryData1);
    // return data.response[0]?.;
    // console.log(data);
    if (data.response?.length === 0) return null;
    else return data.response[0];
  }

  const authenticateUser = async (email, password, done) => {
    // console.log("============================================");
    const user = await getUserByEmail(email);
    if (user == null) {
      console.log("No user with that email");
      return done(null, false, { message: "No user with that email" });
    }
    // console.log(user);
    const query = `SELECT hashed_password, salt FROM agent
      WHERE email = ?`;
    const queryData = [email];
    const data = await db.runQuery(query, queryData);
    // console.log("============================================");
    // console.log(data.response);

    try {
      crypto.pbkdf2(
        password,
        data.response[0].salt,
        310000,
        32,
        "sha256",
        function (err, hashedPassword) {
          if (err) {
            return done(err);
          }
          if (
            !crypto.timingSafeEqual(
              data.response[0].hashed_password,
              hashedPassword
            )
          ) {
            console.log("Incorrect password");

            return done(null, false, {
              message: "Incorrect password.",
            });
          }
          return done(null, user);
        }
      );
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    // const userId =
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;
