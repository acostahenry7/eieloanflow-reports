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

async function getGeneralBalance(queryParams) {
  try {
    const generalBalance = await request({
      method: "GET",
      path: "/account-catalog",
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
  getGeneralBalance,
  getValidationBalance,
  generate606Api,
  generate607Api,
  getMajorGeneral,
};
