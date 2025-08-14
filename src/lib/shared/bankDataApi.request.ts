type ErrorResponse = {
  detail: string;
  summary: string;
  status_code: number;
  type?: string;
};

// Proper error handling - for now, I've decided to just throw Errors and catch them in the most upper level of the app (controllers, server action, API routes). Perfect way would be installing some monitoring / error logging together with it, with some error notification toasts for user.

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
