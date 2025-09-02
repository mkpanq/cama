import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import bankDataApiRequest from "@/lib/shared/bankDataApi.request";
import type { InstitutionApiResponse } from "./institution.type";
import type { ErrorResponse } from "../shared/bankDataApi.type";

export const getInstitutionList = async (): Promise<
  InstitutionApiResponse[]
> => {
  const responseData = await bankDataApiRequest<InstitutionApiResponse[]>({
    method: "GET",
    path: `${APP_CONFIG.API_CONFIG.API_URL_INSTITUTIONS_LIST}`,
    // path: `${APP_CONFIG.API_CONFIG.API_URL_INSTITUTIONS_LIST}?country=PL`,
    auth: await getCurrentApiToken(),
  });

  if (!responseData.ok) {
    const errorMessage = JSON.stringify(responseData.data as ErrorResponse);
    throw new Error(`Failed to institutions list: ${errorMessage}`);
  }

  const institutionsData = responseData.data as InstitutionApiResponse[];

  // For only data testing in the dev
  const testData = institutionsData.filter((data) => {
    return data.id === "SANDBOXFINANCE_SFIN0000";
  });

  return testData;
};

export const getInstitutionDetails = async (
  institutionId: string,
): Promise<InstitutionApiResponse> => {
  const responseData = await bankDataApiRequest<InstitutionApiResponse>({
    method: "GET",
    path: `${APP_CONFIG.API_CONFIG.API_URL_INSTITUTION_DETAILS(institutionId)}`,
    auth: await getCurrentApiToken(),
  });

  if (!responseData.ok) {
    const errorMessage = JSON.stringify(responseData.data as ErrorResponse);
    throw new Error(
      `Failed to get institution (${institutionId}) data: ${errorMessage}`,
    );
  }

  return responseData.data as InstitutionApiResponse;
};
