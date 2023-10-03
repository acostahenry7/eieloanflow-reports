import { request } from "../utils/request";

async function getOutletsApi() {
  try {
    const outlets = await request({ method: "GET", path: "/outlet" });

    return outlets;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { getOutletsApi };
