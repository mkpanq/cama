import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import bankDataApiRequest from "@/lib/shared/bankDataApi.request";
import type { InstitutionApiResponse } from "./institution.type";

export const getInstitutionList = async (): Promise<
  InstitutionApiResponse[]
> => {
  const institutionsData = await bankDataApiRequest<InstitutionApiResponse[]>({
    method: "GET",
    path: `${APP_CONFIG.API_CONFIG.API_URL_INSTITUTIONS_LIST}`,
    // path: `${APP_CONFIG.API_CONFIG.API_URL_INSTITUTIONS_LIST}?country=PL`,
    auth: await getCurrentApiToken(),
  });

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

  return responseData;
};
