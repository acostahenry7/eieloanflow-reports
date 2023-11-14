import { request } from "../utils/request";

async function getLoans(queryParams) {
  try {
    const loans = await request({
      method: "GET",
      path: "/loan",
      urlParams: queryParams || {},
    });

    return loans;
  } catch (error) {
    throw error;
  }
}

async function getLoanActivities(queryParams) {
  try {
    const loans = await request({
      method: "GET",
      path: "/loan-activities",
      urlParams: queryParams || {},
    });

    return loans;
  } catch (error) {
    throw error;
  }
}

async function getLoanDiscounts(queryParams) {
  try {
    const loans = await request({
      method: "GET",
      path: "/loan-discount",
      urlParams: queryParams || {},
    });

    return loans;
  } catch (error) {
    throw error;
  }
}

async function getRegisterClose(queryParams) {
  try {
    const loans = await request({
      method: "GET",
      path: "/register-close",
      urlParams: queryParams || {},
    });

    return loans;
  } catch (error) {
    throw error;
  }
}

export { getLoans, getLoanActivities, getLoanDiscounts, getRegisterClose };
