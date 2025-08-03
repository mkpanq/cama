import type { RefreshedToken } from "./apiToken.type";
import { getRefreshToken } from "./getApiToken";

const refreshApiToken = async (): Promise<RefreshedToken> => {
  const refreshToken = getRefreshToken();

  try {
    const response = await fetch(
      "https://bankaccountdata.gocardless.com/api/v2/token/refresh/",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      },
    );

    const data: RefreshedToken = await response.json();

    return data;
  } catch (error) {
    console.log(`Failed to fetch token - ${error}`);

    return {} as RefreshedToken;
  }
};

export default refreshApiToken;
