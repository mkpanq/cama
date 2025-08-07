import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import bankDataApiRequest from "@/lib/shared/bankDataApi.request";
import type Institution from "./institution.type";
import { getAllConnectedInstitutions } from "../bankConnection/bankConnection.service";

export const getInstitutionList = async (): Promise<Institution[]> => {
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

  const additionalTestData = [
    {
      id: "TESTBANK_TSTBNK0000",
      name: "Test Bank 01",
      bic: "TESTBANK_TSTBNK000",
      transaction_total_days: "180",
      countries: ["PL", "DE"],
      logo: testData[0].logo,
      supported_features: [],
      identification_codes: [],
      max_access_valid_for_days: "1000",
    },
    {
      id: "EXAMPLEBANK_EXBNK0000",
      name: "Example Bank Corporation",
      bic: "EXAMPLEBANK_EXBNK0000",
      transaction_total_days: "180",
      countries: ["PL", "DE"],
      logo: testData[0].logo,
      supported_features: [],
      identification_codes: [],
      max_access_valid_for_days: "1000",
    },
  ];

  const exampleData = [...additionalTestData, ...testData];
  const alreadyConnected = await getAllConnectedInstitutions();

  return exampleData.map((rawInstitution) => ({
    id: rawInstitution.id,
    name: rawInstitution.name,
    bic: rawInstitution.bic,
    maxTransactionTotalDays: Number.parseInt(
      rawInstitution.transaction_total_days,
    ),
    status: alreadyConnected.includes(rawInstitution.id)
      ? "CONNECTED"
      : "NOT_CONNECTED",
    logo: rawInstitution.logo,
    supportedFeatures: rawInstitution.supported_features,
    maxDaysAccess: Number.parseInt(rawInstitution.max_access_valid_for_days),
  }));
};
