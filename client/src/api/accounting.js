import { request } from "../utils/request";
import { config } from "../utils/consts";

async function getAccountCatalog(queryParams) {
  try {
    const gaccountCatalog = await request({
      method: "GET",
      path: "/account-catalog",
      urlParams: queryParams || {},
    });

    return gaccountCatalog;
  } catch (error) {
    throw error;
  }
}

async function getToChargeAccount(queryParams) {
  try {
    const chargeAccount = await request({
      method: "GET",
      path: "/charge-account",
      urlParams: queryParams || {},
    });

    return chargeAccount;
  } catch (error) {
    throw error;
  }
}

async function getPayableAccount(queryParams) {
  try {
    const payableAccount = await request({
      method: "GET",
      path: "/payable-account",
      urlParams: queryParams || {},
    });

    return payableAccount;
  } catch (error) {
    throw error;
  }
}

async function getGeneralBalance(queryParams) {
  try {
    const generalBalance = await request({
      method: "GET",
      path: "/general-balance",
      urlParams: queryParams || {},
    });

    return generalBalance;
  } catch (error) {
    throw error;
  }
}

async function getValidationBalance(queryParams) {
  try {
    const validationBalance = await request({
      method: "GET",
      path: "/validation-balance",
      urlParams: queryParams || {},
    });

    return validationBalance;
  } catch (error) {
    throw error;
  }
}

async function getMajorGeneral(queryParams) {
  try {
    const majorGeneral = await request({
      method: "GET",
      path: "/major-general",
      urlParams: queryParams || {},
    });

    return majorGeneral;
  } catch (error) {
    throw error;
  }
}

async function getBoxMajorByEmployee(queryParams) {
  try {
    const boxMajor = await request({
      method: "GET",
      path: "/box-employee-major",
      urlParams: queryParams || {},
    });

    return boxMajor;
  } catch (error) {
    throw error;
  }
}

async function getSummarizeMajor(queryParams) {
  try {
    const summarizeMajor = await request({
      method: "GET",
      path: "/summarize-major",
      urlParams: queryParams || {},
    });

    return summarizeMajor;
  } catch (error) {
    throw error;
  }
}

async function generate606Api(queryParams) {
  try {
    const is606Generated = await request({
      method: "POST",
      path: "/606",
      urlParams: queryParams || {},
    });

    window.location.assign(is606Generated.body);
  } catch (error) {
    throw error;
  }
}

async function generate607Api(queryParams) {
  try {
    const is607Generated = await request({
      method: "POST",
      path: "/607",
      urlParams: queryParams || {},
    });

    window.location.assign(is607Generated.body);
    return is607Generated;
  } catch (error) {
    throw error;
  }
}

export {
  getAccountCatalog,
  getSummarizeMajor,
  getGeneralBalance,
  getToChargeAccount,
  getPayableAccount,
  getValidationBalance,
  generate606Api,
  generate607Api,
  getMajorGeneral,
  getBoxMajorByEmployee,
};
