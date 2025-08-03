export const getApiToken = () => {
  return "token";
};

export const getRefreshToken = () => {
  return "refresh_token";
};

export const checkTokenValidity = (token: string): boolean => {
  return true;
};

export const saveToken = (token: string) => {};
