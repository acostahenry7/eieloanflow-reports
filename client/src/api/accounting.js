import { request } from "../utils/request";

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

export { getGeneralBalance };
