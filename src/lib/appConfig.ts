const ROUTE_CONFIG = {
  HOME_PATH: "/",
  AUTH_PATH: "/auth",
  INSTITUTIONS_PATH: "/institutions",

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
  API_URL_GET_REQUISITION: (id: string) => `/requisitions/${id}/`,

  API_URL_GET_ACCOUNT_METADATA: (id: string) => `/accounts/${id}`,
  API_URL_GET_ACCOUNT_DETAILS: (id: string) => `/accounts/${id}/details`,
  API_URL_GET_ACCOUNT_BALANCES: (id: string) => `/accounts/${id}/balances`,
  API_URL_GET_ACCOUNT_TRANSACTIONS: (id: string) =>
    `/accounts/${id}/transactions`,
};

const JOBS_CONFIG = {
  QUEUES: {
    BALANCES_QUEUE_NAME: "account_balances_retrieval_queue",
    TRANSACTIONS_QUEUE_NAME: "account_transactions_retrieval_queue",
  },
  JOB_NAMES: {
    BALANCES_JOB_NAME: "get_account_balances_job",
    TRANSACTIONS_JOB_NAME: "get_account_transactions_job",
  },

  ACCOUNT_DATA_WORKER_CONCURRENCY: 3,
};

const APP_CONFIG = {
  ROUTE_CONFIG,
  API_CONFIG,
  JOBS_CONFIG,
};

export default APP_CONFIG;
