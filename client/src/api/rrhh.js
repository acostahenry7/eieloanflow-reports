import { request } from "../utils/request";

async function getEmployees(queryParams) {
  try {
    const employees = await request({
      method: "GET",
      path: "/employee",
      urlParams: queryParams || {},
    });

    return employees;
  } catch (error) {
    throw error;
  }
}

async function getCollectorsCommissionApi(queryParams) {
  try {
    const employees = await request({
      method: "GET",
      path: "/collectors-commission",
      urlParams: queryParams || {},
    });

    return employees;
  } catch (error) {
    throw error;
  }
}

async function getHolidaysApi(queryParams) {
  try {
    const employees = await request({
      method: "GET",
      path: "/holidays",
      urlParams: queryParams || {},
    });

    return employees;
  } catch (error) {
    throw error;
  }
}
async function getEmployeeLoansApi(queryParams) {
  try {
    const employees = await request({
      method: "GET",
      path: "/employee-loans",
      urlParams: queryParams || {},
    });

    return employees;
  } catch (error) {
    throw error;
  }
}

export {
  getEmployees,
  getCollectorsCommissionApi,
  getHolidaysApi,
  getEmployeeLoansApi,
};
