export type ApiToken = {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
};

export type AccessToken = Pick<ApiToken, "access" | "access_expires">;
export type RefreshToken = Pick<ApiToken, "refresh" | "refresh_expires">;
