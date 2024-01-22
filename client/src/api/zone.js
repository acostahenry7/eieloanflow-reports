import { request } from "../utils/request";

async function getZonesApi(queryParams) {
  console.log("QUERY PARAMS", queryParams);
  try {
    const zones = await request({
      method: "GET",
      path: "/zone",
      urlParams: queryParams,
    });

    return zones;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { getZonesApi };
