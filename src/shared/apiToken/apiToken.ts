import type { AccessToken, ApiToken } from "./apiToken.type";
import getNewApiToken from "./getNewApiToken.request";
import refreshApiToken from "./refreshApiToken.request";

export const getNewToken = async (): Promise<ApiToken | undefined> => {
  try {
    const data = await getNewApiToken();
    console.log(data);
    return {
      access: {
        access: data.access,
        access_expires: convertExpirationTimeToDate(data.access_expires),
      },
      refresh: {
        refresh: data.refresh,
        refresh_expires: convertExpirationTimeToDate(data.refresh_expires),
      },
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const refreshToken = async (
  refreshToken: string,
): Promise<AccessToken | undefined> => {
  try {
    const data = await refreshApiToken(refreshToken);

    return {
      access: data.access,
      access_expires: convertExpirationTimeToDate(data.access_expires),
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const isTokenValid = (token: AccessToken): boolean => {
  const now = Date.now();
  const tokenExpires = token.access_expires;

  return now < tokenExpires;
};

export const convertExpirationTimeToDate = (expirationTime: number): number => {
  const now = Date.now();
  return now + expirationTime * 1000;
};
