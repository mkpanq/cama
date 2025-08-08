const ROUTE_CONFIG = {
  AUTH_PATH: "/auth",
  HOME_PATH: "/",

  API_CREATE_REQUISITION_WEBHOOK: "/api/requisition/confirm",
};

const API_CONFIG = {
  API_ACCESS_TOKEN_COOKIE_NAME: "api_access_token",
  API_REFRESH_TOKEN_COOKIE_NAME: "api_refresh_token",

  API_URL_NEW_TOKEN: "/token/new/",
  API_URL_REFRESH_TOKEN: "/token/refresh/",

  API_URL_INSTITUTIONS_LIST: "/institutions",

  API_URL_CREATE_AGREEMENT: "/agreements/enduser/",
  API_URL_CREATE_REQUISITION: "/requisitions/",

  API_URL_GET_ACCOUNT_METADATA: (id: string) => `/accounts/${id}`,
  API_URL_GET_ACCOUNT_DETAILS: (id: string) => `/accounts/${id}/details`,
  API_URL_GET_ACCOUNT_BALANCES: (id: string) => `/accounts/${id}/balances`,
  API_URL_GET_ACCOUNT_TRANSACTIONS: (id: string) =>
    `/accounts/${id}/transactions`,
};

const JOBS_CONFIG = {
  ACCOUNT_DATA_QUEUE_NAME: "account_data_retrieval",
  ACCOUNT_DATA_JOB_NAME: "get_account_data",
  ACCOUNT_DATA_WORKER_CONCURRENCY: 3,
};

const APP_CONFIG = {
  ROUTE_CONFIG,
  API_CONFIG,
  JOBS_CONFIG,
};

export default APP_CONFIG;
