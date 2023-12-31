const db = require("../models");
const bcrypt = require("bcryptjs");

const controller = {};

controller.signin = async (data) => {
  try {
    console.log(data);

    const [user, meta] = await db.query(
      `select * from jhi_user where login = '${data.username}'`
    );

    if (user.length > 0) {
      return bcrypt
        .compare(data.password, user[0].password_hash)
        .then((res) => {
          console.log("HERE", res);
          if (res === true) {
            console.log(res);
            return user;
          } else {
            console.log("hey error");
            throw new Error("Invalid username or password");
          }
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err.message);
        });
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

module.exports = controller;
