export type ApiToken = {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
};

export type RefreshedToken = Pick<ApiToken, "access" | "access_expires">;
