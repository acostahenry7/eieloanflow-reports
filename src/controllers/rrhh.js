const db = require("../models");

const controller = {};

controller.getEmployees = async (queryParams) => {
  try {
    const [data] = await db.query(
      `SELECT first_name || ' ' || last_name as employee_name, e.email, date_of_hire, salary, birth_date, sex,
            e.phone, e.mobile, d.name as department, p.name as position, identification, departure_date, e.status_type, e.created_date
            FROM employee e
            JOIN department d ON (e.department_id = d.department_id)
            JOIN outlet o ON (e.outlet_id = o.outlet_id)
            JOIN position p ON (e.position_id = p.position_id)
            WHERE e.status_type NOT IN ('DELETE')
            AND e.status_type like '${queryParams.statusType || "%"}'
            AND e.outlet_id like '${queryParams.outletId || "%"}'`
    );
    //  `AND e.created_date::date BETWEEN '' AND ''
    //  AND e.date_of_hire::date BETWEEN '' AND ''
    //  AND e.status_type like ''`

    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = controller;
