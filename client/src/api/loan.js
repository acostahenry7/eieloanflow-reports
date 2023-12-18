import { request } from "../utils/request";

async function getLoans(queryParams, loanId) {
  try {
    const loans = await request({
      method: "GET",
      path: "/loan",
      urlParams: { ...queryParams, loanId } || {},
    });

    return loans;
  } catch (error) {
    throw error;
  }
}

async function getLoanDetail(id) {
  try {
    const loans = await request({
      method: "GET",
      path: `/loanDetail/${id}`,
      urlParams: {},
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

export {
  getLoans,
  getLoanActivities,
  getLoanDiscounts,
  getRegisterClose,
  getLoanDetail,
};
