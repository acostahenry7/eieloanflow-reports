import { config } from "./consts";

async function request({ method, path, urlParams, data, isFormData }) {
  let options = {
    method,
  };

  if (!isFormData) {
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  switch (method) {
    case "POST":
      options.method = "POST";
      options.body = !isFormData ? JSON.stringify(data) : data;

      break;

    default:
      break;
  }

  let entry, key, value;
  let queryParams = "";

  if (urlParams) {
    for (entry of Object.entries(urlParams)) {
      key = entry[0];
      value = entry[1];
      queryParams += `${key}=${value}&`;
    }
  }

  try {
    let res = await fetch(
      `${config.server.url}${path}?${queryParams}`,
      options
    );
    let result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export { request };
