const db = require("../models");
const { generateWhereStatement, getDateRangeFilter } = require("../utils");

const controller = {};

controller.getGeneralBalance = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data, meta] = await db.query(`SELECT *
      FROM account_catalog
      WHERE outlet_id = '4a812a14-f46d-4a99-8d88-c1f14ea419f4'`);

    if (data.length == 0) {
      return [];
    }
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = controller;
