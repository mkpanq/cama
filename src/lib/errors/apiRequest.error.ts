export type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE" | string;

export interface ApiRequestErrorDetails {
  method: ApiRequestMethod;
  url: string;
  status?: number;
  statusText?: string;
  requestId?: string;
  error?: unknown;
}

export interface ApiErrorBody {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

export class ApiRequestError extends Error {
  public readonly name = "ApiRequestError";
  public readonly method: ApiRequestMethod;
  public readonly url: string;
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly requestId?: string;
  public readonly error?: unknown;

  constructor(details: ApiRequestErrorDetails) {
    const base = `${details.method} ${details.url}`;
    const statusPart =
      details.status !== undefined
        ? ` - ${details.status}${details.statusText ? ` ${details.statusText}` : ""}`
        : "";
    const reqIdPart = details.requestId
      ? ` (requestId: ${details.requestId})`
      : "";
    super(`API request failed: ${base}${statusPart}${reqIdPart}`.trim());

    Object.setPrototypeOf(this, new.target.prototype);

    this.method = details.method;
    this.url = details.url;
    this.status = details.status;
    this.statusText = details.statusText;
    this.requestId = details.requestId;
    this.error = details.error;
  }

  get isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status !== undefined && this.status >= 500;
  }

  get isRetryable(): boolean {
    return this.isServerError || this.status === 429;
  }

  static async fromResponse(
    response: Response,
    opts: { method: ApiRequestMethod; url: string },
  ): Promise<ApiRequestError> {
    const requestId = response.headers.get("x-request-id") ?? undefined;
    const statusText = response.statusText || undefined;

    let parsedBody: unknown;
    try {
      // Attempt JSON first; fall back to text
      const clone = response.clone();
      const contentType = clone.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        parsedBody = (await clone.json()) as ApiErrorBody;
      } else {
        parsedBody = await clone.text();
      }
    } catch {
      // Ignore body parse errors
      parsedBody = undefined;
    }

    const err = new ApiRequestError({
      method: opts.method,
      url: opts.url,
      status: response.status,
      statusText,
      requestId,
      error: parsedBody,
    });

    return err;
  }
}

export default ApiRequestError;
