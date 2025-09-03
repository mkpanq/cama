import ApiRequestError from "@/lib/errors/apiRequest.error";

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
    // Only include a body if provided; avoid sending for GET by default
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok)
    throw await ApiRequestError.fromResponse(response, {
      method,
      url: fullUrl,
    });

  const data = (await response.json()) as T;
  return data;
};

export default bankDataApiRequest;
