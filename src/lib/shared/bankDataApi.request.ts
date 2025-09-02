import type { BankDataApiResponse } from "./bankDataApi.type";

const bankDataApiRequest = async <T>({
  path,
  method,
  body,
  auth,
}: {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  auth?: string;
}): Promise<BankDataApiResponse<T>> => {
  const fullUrl = `${process.env.GOCARDLESS_API_URL}${path}`;
  const response = await fetch(fullUrl, {
    method,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(auth ? { authorization: `Bearer ${auth}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    data,
  };
};

export default bankDataApiRequest;
