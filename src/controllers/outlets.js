const db = require("../models");

const controller = {};

controller.getOutlets = async () => {
  try {
    const [outlets, meta] = await db.query(`
    SELECT * 
    from outlet
    where parent_id in ('781b424d-1bd4-4030-a2c3-027607918938')`);

    if (outlets.length > 0) {
      return outlets;
    }

    return [];
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;
