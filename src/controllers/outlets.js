const db = require("../models");

const controller = {};

controller.getOutlets = async () => {
  try {
    const [outlets, meta] = await db.query(`SELECT * FROM outlet`);

    if (outlets.length > 0) {
      return outlets;
    }

    return [];
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;
