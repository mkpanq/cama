export type ErrorResponse = {
  summary: string;
  detail: string;
  status_code: number;
};

export type BankDataApiResponse<T> = {
  ok: boolean;
  data: T | ErrorResponse;
};
