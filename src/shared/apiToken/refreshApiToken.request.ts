import type { ErrorResponse } from "../errorResponse.type";
import type { AccessToken } from "./apiToken.type";

const refreshApiToken = async (refreshToken: string): Promise<AccessToken> => {
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

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(
      `${error.status_code} - ${error.summary} - ${error.detail}`,
    );
  }

  const data = await response.json();
  return data;
};

export default refreshApiToken;
