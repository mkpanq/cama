import type { ErrorResponse } from "./errorResponse.type";

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
}): Promise<T> => {
  const fullUrl = `${process.env.GOCARDLESS_API_URL}${path}`;
  const response = await fetch(fullUrl, {
    method,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      ...(auth ? { authorization: `Bearer ${auth}` } : {}),
      body: JSON.stringify(body),
    },
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(JSON.stringify(error));
  }

  const data: T = await response.json();

  return data;
};
