import { request } from "../utils/request";

async function getOutletsApi(queryParams) {
  try {
    const outlets = await request({
      method: "GET",
      path: "/outlet",
      urlParams: queryParams || {},
    });

    return outlets;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { getOutletsApi };
