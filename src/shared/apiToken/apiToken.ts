import type { AccessToken } from "./apiToken.type";

export const isTokenValid = (token: AccessToken): boolean => {
  const now = new Date();
  const tokenExpires = new Date(token.access_expires * 1000);

  return now < tokenExpires;
};
