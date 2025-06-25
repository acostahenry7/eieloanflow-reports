const db = require("../models");

const controller = {};

controller.getZones = async (queryParams) => {
  try {
    console.log("zones", queryParams);
    const [zones, meta] = await db.query(`SELECT zone_id, name 
    from zone 
    where outlet_id like '${queryParams.outletId || ""}%'
    and status_type = 'ENABLED'
    order by name`);

    if (zones.length > 0) {
      return zones;
    }

    return [];
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = controller;
