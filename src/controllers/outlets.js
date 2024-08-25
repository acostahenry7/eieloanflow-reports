const db = require("../models");

const controller = {};

controller.getOutlets = async (queryParams) => {
  try {
    console.log(queryParams);
    const [outlets, meta] = await db.query(`
    SELECT * 
    from outlet
    where parent_id in (select parent_id from outlet where outlet_id like '${
      !queryParams.outletId || queryParams.outletId == "null"
        ? "%"
        : queryParams.outletId
    }')`);

    if (outlets.length > 0) {
      return outlets;
    }

    return [];
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;
