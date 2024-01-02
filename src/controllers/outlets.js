const db = require("../models");

const controller = {};

controller.getOutlets = async () => {
  try {
    const [outlets, meta] = await db.query(`SELECT * 
    FROM outlet 
    WHERE parent_id in ('781b424d-1bd4-4030-a2c3-027607918938',
                        'b25c5f4b-435d-416d-8c43-fa9e1e60bac2')
    OR outlet_id in ('781b424d-1bd4-4030-a2c3-027607918938',
                        'b25c5f4b-435d-416d-8c43-fa9e1e60bac2')`);

    if (outlets.length > 0) {
      return outlets;
    }

    return [];
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;
