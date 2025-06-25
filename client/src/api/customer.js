import { request } from "../utils/request";

async function getArrearCustomersApi(queryParams) {
  try {
    const customers = await request({
      method: "GET",
      path: "/customer",
      urlParams: queryParams,
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function getCustomerLoanApi(queryParams) {
  try {
    const customers = await request({
      method: "GET",
      path: "/customer-loan",
      urlParams: queryParams,
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function getCustomerAccountStatusApi(queryParams) {
  try {
    const customers = await request({
      method: "GET",
      path: "/customer-account-status",
      urlParams: queryParams,
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

export {
  getArrearCustomersApi,
  getCustomerLoanApi,
  getCustomerAccountStatusApi,
};
