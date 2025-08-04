import type { ErrorResponse } from "../errorResponse.type";

type ReceivedApiToken = {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
};

const getNewApiToken = async (): Promise<ReceivedApiToken> => {
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
    throw new Error(JSON.stringify(error));
  }

  const data = await response.json();
  return data;
};

export default getNewApiToken;
