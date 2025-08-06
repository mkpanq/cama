import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import bankDataApiRequest from "@/lib/shared/bankDataApi.request";
import type Institution from "./institution.type";

export const getInstitutionList = async (): Promise<Institution[]> => {
  try {
    const data = await bankDataApiRequest<
      {
        id: string;
        name: string;
        bic: string;
        transaction_total_days: string;
        countries: string[];
        logo: string;
        supported_features: string[];
        identification_codes: string[];
        max_access_valid_for_days: string;
      }[]
    >({
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

    return testData.map((rawInstitution) => ({
      id: rawInstitution.id,
      name: rawInstitution.name,
      bic: rawInstitution.bic,
      maxTransactionTotalDays: Number.parseInt(
        rawInstitution.transaction_total_days,
      ),
      logo: rawInstitution.logo,
      supportedFeatures: rawInstitution.supported_features,
      maxDaysAccess: Number.parseInt(rawInstitution.max_access_valid_for_days),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
