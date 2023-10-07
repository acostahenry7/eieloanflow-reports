import { request } from "../utils/request";

async function getLoans(queryParams) {
  try {
    const loans = await request({
      method: "GET",
      path: "/loan",
      urlParams: queryParams || {},
    });

    return loans;
  } catch (error) {
    throw error;
  }
}

export { getLoans };
