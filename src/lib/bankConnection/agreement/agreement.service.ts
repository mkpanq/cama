import "server-only";

import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import bankDataApiRequest from "@/lib/shared/bankDataApi.request";
import type {
  EndUserAgreement,
  EndUserAgreementApiResponse,
} from "./agreement.type";
import type { ErrorResponse } from "@/lib/shared/bankDataApi.type";

export const returnNewAgreement = async (
  institutionId: string,
  maxHistoricalDays: number,
  validFor: number,
): Promise<EndUserAgreement | undefined> => {
  try {
    const agreementData = await sendRequestForNewAgreement(
      institutionId,
      maxHistoricalDays,
      validFor,
    );

    return {
      id: agreementData.id,
      institutionId: agreementData.institution_id,
      maxHistoricalDays: agreementData.max_historical_days,
      createdDate: new Date(),
      expirationDate: new Date(Date.now() + validFor * 24 * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error(error);
    return;
  }
};

const sendRequestForNewAgreement = async (
  institutionId: string,
  maxHistoricalDays: number,
  validFor: number,
): Promise<EndUserAgreementApiResponse> => {
  const responseData = await bankDataApiRequest<EndUserAgreementApiResponse>({
    method: "POST",
    path: APP_CONFIG.API_CONFIG.API_URL_CREATE_AGREEMENT,
    auth: await getCurrentApiToken(),
    body: {
      institution_id: institutionId,
      max_historical_days: maxHistoricalDays,
      access_valid_for_days: validFor,
      access_scope: ["balances", "details", "transactions"],
    },
  });

  if (!responseData.ok) {
    const errorMessage = JSON.stringify(responseData.data as ErrorResponse);
    throw new Error(`Failed to create enduser agreement: ${errorMessage}`);
  }

  return responseData.data as EndUserAgreementApiResponse;
};
