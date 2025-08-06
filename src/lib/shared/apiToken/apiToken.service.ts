import APP_CONFIG from "@/lib/appConfig";
import type { AccessToken, ApiToken } from "./apiToken.type";
import bankDataApiRequest from "../bankDataApi.request";
import { cookies } from "next/headers";

export const getNewToken = async (): Promise<ApiToken | undefined> => {
  const secretId = process.env.GOCARDLESS_SECRET_ID;
  const secretKey = process.env.GOCARDLESS_SECRET_KEY;

  try {
    const data = await bankDataApiRequest<{
      access: string;
      access_expires: number;
      refresh: string;
      refresh_expires: number;
    }>({
      path: APP_CONFIG.API_CONFIG.API_URL_NEW_TOKEN,
      method: "POST",
      body: { secret_id: secretId, secret_key: secretKey },
    });

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

export const getRefreshedToken = async (
  refreshToken: string,
): Promise<AccessToken | undefined> => {
  try {
    const data = await bankDataApiRequest<AccessToken>({
      path: APP_CONFIG.API_CONFIG.API_REFRESH_TOKEN_COOKIE_NAME,
      method: "POST",
      body: { refresh: refreshToken },
    });

    return {
      access: data.access,
      access_expires: convertExpirationTimeToDate(data.access_expires),
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getCurrentApiToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(
    APP_CONFIG.API_CONFIG.API_ACCESS_TOKEN_COOKIE_NAME,
  );

  if (!cookie) return undefined;
  const accessData = JSON.parse(cookie.value) as AccessToken;

  return accessData.access;
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
