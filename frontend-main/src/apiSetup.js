import axios from "axios";
import { handleMockRequest } from "./mockService";

const isStaticHosted =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

// 1. Intercept Axios requests
axios.interceptors.request.use(async (config) => {
  if (isStaticHosted) {
    const mockRes = handleMockRequest(config.method, config.url, config.data);
    if (mockRes) {
      config.adapter = () => {
        return Promise.resolve({
          data: mockRes.data,
          status: mockRes.status,
          statusText: "OK",
          headers: {},
          config: config,
        });
      };
    }
  }
  return config;
});

// Fallback on network errors
axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.config && (!error.response || error.message === "Network Error")) {
      let bodyData = null;
      try {
        bodyData = typeof error.config.data === "string"
          ? JSON.parse(error.config.data)
          : error.config.data;
      } catch (e) {
        bodyData = error.config.data;
      }
      const mockRes = handleMockRequest(
        error.config.method,
        error.config.url,
        bodyData
      );
      if (mockRes) {
        return Promise.resolve({
          data: mockRes.data,
          status: mockRes.status,
          statusText: "OK",
          headers: {},
          config: error.config,
        });
      }
    }
    return Promise.reject(error);
  }
);

// 2. Intercept window.fetch
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  const url = typeof input === "string" ? input : input.url;
  const method = init?.method || "GET";
  let body = null;
  try {
    body = init?.body ? JSON.parse(init.body) : null;
  } catch (e) {
    body = init?.body;
  }

  if (isStaticHosted) {
    const mockRes = handleMockRequest(method, url, body);
    if (mockRes) {
      return new Response(JSON.stringify(mockRes.data), {
        status: mockRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  try {
    return await originalFetch(input, init);
  } catch (err) {
    const mockRes = handleMockRequest(method, url, body);
    if (mockRes) {
      return new Response(JSON.stringify(mockRes.data), {
        status: mockRes.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw err;
  }
};
