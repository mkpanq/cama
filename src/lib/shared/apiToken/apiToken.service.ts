import APP_CONFIG from "@/lib/appConfig";
import type { AccessToken, ApiToken, TokenApiResponse } from "./apiToken.type";
import bankDataApiRequest from "../bankDataApi.request";
import { cookies } from "next/headers";

export const getNewToken = async (): Promise<ApiToken> => {
  const secretId = process.env.GOCARDLESS_SECRET_ID;
  const secretKey = process.env.GOCARDLESS_SECRET_KEY;
  const token = await bankDataApiRequest<TokenApiResponse>({
    path: APP_CONFIG.API_CONFIG.API_URL_NEW_TOKEN,
    method: "POST",
    body: { secret_id: secretId, secret_key: secretKey },
  });

  return {
    access: {
      access: token.access,
      access_expires: convertExpirationTimeToDate(token.access_expires),
    },
    refresh: {
      refresh: token.refresh,
      refresh_expires: convertExpirationTimeToDate(token.refresh_expires),
    },
  };
};

export const getRefreshedToken = async (
  refreshToken: string,
): Promise<AccessToken> => {
  const token = await bankDataApiRequest<AccessToken>({
    path: APP_CONFIG.API_CONFIG.API_URL_REFRESH_TOKEN,
    method: "POST",
    body: { refresh: refreshToken },
  });

  return {
    access: token.access,
    access_expires: convertExpirationTimeToDate(token.access_expires),
  };
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
