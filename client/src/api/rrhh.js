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

export { getEmployees };
