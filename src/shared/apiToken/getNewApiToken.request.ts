import type { ApiToken } from "./apiToken.type";

const getNewApiToken = async (): Promise<ApiToken> => {
  const secretId = process.env.GOCARDLESS_SECRET_ID;
  const secretKey = process.env.GOCARDLESS_SECRET_KEY;

  try {
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

    const data: ApiToken = await response.json();

    return data;
  } catch (error) {
    console.log(`Failed to fetch token - ${error}`);

    return {} as ApiToken;
  }
};

export default getNewApiToken;
