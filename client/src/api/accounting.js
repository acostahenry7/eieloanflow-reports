import { request } from "../utils/request";
import { config } from "../utils/consts";

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

async function generate606Api(queryParams) {
  try {
    const is606Generated = await request({
      method: "POST",
      path: "/606",
      urlParams: queryParams || {},
    });

    return setTimeout(() => {
      window.location.assign(is606Generated.body);
      return is606Generated;
    }, 3000);
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

    return setTimeout(() => {
      console.log(is607Generated);
      window.location.assign(is607Generated.body);
      return is607Generated;
    }, 3000);
  } catch (error) {
    throw error;
  }
}

export {
  getGeneralBalance,
  getValidationBalance,
  generate606Api,
  generate607Api,
  getMajorGeneral,
};
