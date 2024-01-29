import { request } from "../utils/request";

async function getLoanApplication(queryParams) {
  try {
    const loanApplication = await request({
      method: "GET",
      path: "/loan-application",
      urlParams: { ...queryParams } || {},
    });

    return loanApplication;
  } catch (error) {
    throw error;
  }
}

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

async function getLoanMovement(queryParams) {
  try {
    const loanMovements = await request({
      method: "GET",
      path: "/loan-movement",
      urlParams: queryParams || {},
    });

    return loanMovements;
  } catch (error) {
    throw error;
  }
}

async function getDatacreditLoans(queryParams) {
  try {
    const loans = await request({
      method: "GET",
      path: "/datacredit-loan",
      urlParams: queryParams || {},
    });

    return loans;
  } catch (error) {
    throw error;
  }
}

async function generateDatacredit(queryParams) {
  try {
    const isDatacreditGenerated = await request({
      method: "POST",
      path: "/data-credit",
      urlParams: queryParams || {},
    });

    window.location.assign(isDatacreditGenerated.body);
    return isDatacreditGenerated;
  } catch (error) {
    throw error;
  }
}

async function getAmortizationTable(queryParams) {
  try {
    const amortization = await request({
      method: "GET",
      path: "/amortization-table",
      urlParams: queryParams || {},
    });

    return amortization;
  } catch (error) {
    throw error;
  }
}

export {
  getLoanApplication,
  getLoans,
  getLoanActivities,
  getLoanDiscounts,
  getRegisterClose,
  getLoanMovement,
  getLoanDetail,
  generateDatacredit,
  getDatacreditLoans,
  getAmortizationTable,
};
