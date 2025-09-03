export type ApiToken = {
  access: AccessToken;
  refresh: RefreshToken;
};

export type AccessToken = {
  access: string;
  access_expires: number;
};

export type RefreshToken = {
  refresh: string;
  refresh_expires: number;
};

export type TokenApiResponse = {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
};
