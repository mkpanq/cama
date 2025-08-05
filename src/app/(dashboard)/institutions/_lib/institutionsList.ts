import APP_CONFIG from "@/appConfig";
import { getCurrentApiToken } from "@/shared/apiToken/apiToken";
import bankDataApiRequest from "@/shared/bankDataApi.request";
import type Institution from "./institution.type";

export const getInstitutionList = async () => {
  try {
    const data = await bankDataApiRequest<Institution[]>({
      method: "GET",
      // TODO: For testing and development let's add just test bank
      // path: `${APP_CONFIG.API_CONFIG.API_URL_INSTITUTIONS_LIST}?country=PL`,
      path: `${APP_CONFIG.API_CONFIG.API_URL_INSTITUTIONS_LIST}`,
      auth: await getCurrentApiToken(),
    });

    // TODO: Just for testing
    const testData = data.filter(
      (institution) => institution.id === "SANDBOXFINANCE_SFIN0000",
    );

    return testData;
  } catch (error) {
    console.error(error);
    return [];
  }
};
