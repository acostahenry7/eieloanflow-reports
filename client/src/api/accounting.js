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
    }, 500);

    // setTimeout(async () => {
    //   fetch(`${config.server.url}/606?fileName=${is606Generated.body}`)
    //     .then((res) => res.blob())
    //     .then((blob) => {
    //       var file = window.URL.createObjectURL(blob);
    //       window.location.assign(file);
    //     });
    // }, 2000);
  } catch (error) {
    throw error;
  }
}

export { getGeneralBalance, getValidationBalance, generate606Api };
