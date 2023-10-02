import { config } from "./consts";

async function request({ method, path, urlParams, data }) {
  let options = {};

  switch (method) {
    case "POST":
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      break;

    default:
      break;
  }

  try {
    let res = await fetch(`${config.server.url}${path}`, options);
    let result = await res.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export { request };
