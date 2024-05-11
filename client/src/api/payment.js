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

async function getCollectorVisitsApi(queryParams) {
  try {
    const visits = await request({
      method: "GET",
      path: "/payment/collector-visits",
      urlParams: queryParams || {},
    });

    return visits;
  } catch (error) {
    throw error;
  }
}

async function getPaidMora(queryParams) {
  try {
    const paidMora = await request({
      method: "GET",
      path: "/payment/paid-mora",
      urlParams: queryParams || {},
    });

    return paidMora;
  } catch (error) {
    throw error;
  }
}

async function getReceiptDetail(queryParams) {
  try {
    const receipts = await request({
      method: "GET",
      path: "/payment/receipt-detail",
      urlParams: queryParams || {},
    });

    return receipts;
  } catch (error) {
    throw error;
  }
}

async function getGroupRegisterClose(queryParams) {
  try {
    const paidMora = await request({
      method: "GET",
      path: "/payment/grouped-register-close",
      urlParams: queryParams || {},
    });

    return paidMora;
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
  getCollectorVisitsApi,
  getPaidMora,
  getReceiptDetail,
  getGroupRegisterClose,
};
