import APP_CONFIG from "@/appConfig";
import { getCurrentApiToken } from "@/shared/apiToken/apiToken";
import bankDataApiRequest from "@/shared/bankDataApi.request";
import type Institution from "./institution.type";

// Clicked on proper instituion, will create requisition (or agreement) and save it to the DB
// Then, we'll save current requistion institution details to DB
// And after that we'll run background job for downloading all transactions and save it to DB

// After that operation, we'll be able to retreive all data from the database and (if we would like to) refetch / update them
// on demand from the dashboard

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
