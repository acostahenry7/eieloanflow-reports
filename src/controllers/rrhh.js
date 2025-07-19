const db = require("../models");
const { getDateRangeFilter, getGenericLikeFilter } = require("../utils");

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

controller.getCollectorsCommission = async (queryParams) => {
  try {
    const [data] = await db.query(
      `select  
      ec.employee_name, 
      trunc(sum(p.pay)/11,2) pay, 
      --to_char(p.created_date::date,'TMDay DD Mon YYYY') as date,
      to_char(r.last_modified_date::date,'TMDay DD Mon YYYY') as date,
      min(ec.commission_pct) || '%' as commission_pct, 
      round(sum(p.pay) * min(ec.commission_pct)/100 /11) commission, 
      (count(l.loan_number_id::varchar) filter (where p.payment_origin = 'APP'))/11 as app_payments,
      (count(l.loan_number_id::varchar) filter (where p.payment_origin = 'SOFWARE'))/11 as soft ware_payments,
      p.register_id,
	  r.total_cash + r.total_transfer + r.total_check as total_collected,
      sum(rd.total)  as total_cash_registered,
	  r.total_deposit,
      (sum(rd.total) + r.total_deposit) - (r.total_cash + r.total_transfer + r.total_check) as difference
    from payment p
    join (select employee_id, first_name || ' ' || last_name as employee_name,
       coalesce(commission_debt_collector_percentage,0) commission_pct
       from employee
       where status_type = 'ENABLED'
        
        ${getGenericLikeFilter("outlet_id", queryParams.outletId)}
       and department_id in (select department_id from department ${getGenericLikeFilter(
         "outlet_id",
         queryParams.outletId,
         true
       )} and code = 'COLL')
       order by first_name) ec on (p.employee_id = ec.employee_id)
    join loan l on (p.loan_id = l.loan_id)
    join register r on (p.register_id = r.register_id)
    join register_detail rd on (r.register_id = rd.register_id)
    ${getGenericLikeFilter("p.outlet_id", queryParams.outletId, true)}
    ${getDateRangeFilter(
      "r.last_modified_date",
      queryParams.dateFrom,
      queryParams.dateTo,
      true
    )}
    AND p.status_type = 'ENABLED'
    group by ec.employee_id, ec.employee_name,p.register_id, r.last_modified_date::date, r.total_registered,
    r.total_cash, r.total_transfer, r.total_check, r.total_deposit
    order by r.last_modified_date::date`
    );
    //  `AND e.created_date::date BETWEEN '' AND ''
    //  AND e.date_of_hire::date BETWEEN '' AND ''
    //  AND e.status_type like ''`

    return data;
  } catch (error) {
    console.log(error);
  }
};

controller.getHolidays = async (queryParams) => {
  console.log(queryParams);
  try {
    const [data] = await db.query(
      `select 
      pr.payroll_id,
      pr.description as payroll_description, 
      amount,  
      pr.created_date::date, 
      pr.last_modified_date as process_date, 
      emp.identification,
      emp.first_name|| ' ' || emp.last_name as employee_name,
      emp.salary,
      d.name as department,
      pos.name as position,
      pre.total_entry,
      pre.total_deduction,
      pre.total,
      prp.name as parameter,
      ppe.value,
      ppe.amount_entry,
      ppe.amount_deduction,
      pr.outlet_id
    from payroll pr
    left join payroll_employee pre on (pr.payroll_id = pre.payroll_id)
    left join employee_payroll_group epg on (pre.employee_payroll_group_id = epg.employee_payroll_group_id)
    left join payroll_parameter_employee ppe on (pre.payroll_employee_id = ppe.payroll_employee_id)
    left join payroll_parameter prp on (ppe.payroll_parameter_id = prp.payroll_parameter_id)
    left join employee emp on (epg.employee_id = emp.employee_id)
    join department d on (emp.department_id = d.department_id)
    join position pos on (emp.position_id = pos.position_id)
    ${getGenericLikeFilter("pr.outlet_id", queryParams.outletId, true)}
    and prp.code = '${queryParams.type}'
    order by pr.created_date desc`
    );
    //  `AND e.created_date::date BETWEEN '' AND ''
    //  AND e.date_of_hire::date BETWEEN '' AND ''
    //  AND e.status_type like ''`

    return data;
  } catch (error) {
    console.log(error);
  }
};

controller.getEmployeeLoans = async (queryParams) => {
  try {
    const [data] = await db.query(`select 
    e.first_name || ' ' || e.last_name as employee_name,
    e.identification,
    e.status_type as employee_status,
    cl.loan_number,
    l.amount_approved,
    l.number_of_installments,
    l.amount_of_free,
    l.status_type as loan_status,
    la.loan_type,
    l.loan_situation,
    l.created_date
  from customer_loan cl
  join loan l on (cl.loan_id = l.loan_id)
  join employee e on (cl.employee_id = e.employee_id)
  join loan_application la on (l.loan_application_id = la.loan_application_id)
  where cl.employee_id is not null
  and l.status_type <> 'DELETE'
  `);

    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = controller;
