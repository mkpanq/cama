import type { ErrorResponse } from "../errorResponse.type";
import type { ApiToken } from "./apiToken.type";

const getNewApiToken = async (): Promise<ApiToken> => {
  const secretId = process.env.GOCARDLESS_SECRET_ID;
  const secretKey = process.env.GOCARDLESS_SECRET_KEY;

  const response = await fetch(
    "https://bankaccountdata.gocardless.com/api/v2/token/new/",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secret_id: secretId, secret_key: secretKey }),
    },
  );

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(`${error.summary} - ${error.detail}`);
  }

  const data: ApiToken = await response.json();
  return data;
};

export default getNewApiToken;
