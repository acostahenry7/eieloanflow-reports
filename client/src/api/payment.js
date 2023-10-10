import { request } from "../utils/request";

async function getTodayPaymentsApi(queryParams) {
  try {
    const customers = await request({
      method: "GET",
      path: "/payment/today",
      urlParams: queryParams || {},
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function getCanceledPaymentsApi(queryParams) {
  try {
    const customers = await request({
      method: "GET",
      path: "/payment/canceled",
      urlParams: queryParams || {},
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function getReceivedPaymentsApi(queryParams) {
  try {
    const customers = await request({
      method: "GET",
      path: "/payment/received",
      urlParams: queryParams || {},
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function getPaymentProyectionApi(queryParams) {
  try {
    const customers = await request({
      method: "GET",
      path: "/payment/proyection",
      urlParams: queryParams || {},
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function getHistoryPaymentControl(queryParams) {
  try {
    const customers = await request({
      method: "GET",
      path: "/payment/control-history",
      urlParams: queryParams || {},
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

export {
  getTodayPaymentsApi,
  getCanceledPaymentsApi,
  getReceivedPaymentsApi,
  getPaymentProyectionApi,
  getHistoryPaymentControl,
};
