type ErrorResponse = {
  detail: string;
  summary: string;
  status_code: number;
  type?: string;
};

// TODO: Add Tanstack Query for improving data caching and Errors and it's handling - decide where to return empty return and where to throw exception to catch it later.
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
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(JSON.stringify(error));
  }

  const data: T = await response.json();

  return data;
};

export default bankDataApiRequest;
