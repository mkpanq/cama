const bankApiRequest = async <T>({
  path,
  method,
  body,
}: {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  needAuthorization?: boolean;
}): Promise<T> => {
  const fullUrl = `${process.env.GOCARDLESS_API_URL}${path}`;

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: T = await response.json();

    return data;
  } catch (error) {
    console.error(`Failed to fetch data from path: ${path} \n Error: ${error}`);

    // TODO: For now just return empty object - it's much easier to handle
    // Later will take care about proper error handling
    return {} as T;
  }
};
