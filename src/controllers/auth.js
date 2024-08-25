const db = require("../models");
const bcrypt = require("bcryptjs");

const controller = {};

controller.signin = async (data) => {
  try {
    console.log(data);

    const [user, meta] = await db.query(
      `select ju.*, ath.name as role_name, ath.description, string_agg(pvl.module, ',') as allowed_modules
      from jhi_user ju
      left join authority ath on (ju.authority_id = ath.authority_id)
      left join privilege pvl on (ju.authority_id = pvl.authority_id and pvl.access <> 'NONE')
      where ju.login = '${data.username}'
      group by ju.user_id, ath.authority_id`
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
