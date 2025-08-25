import "server-only";

import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import bankDataApiRequest from "@/lib/shared/bankDataApi.request";
import type Agreement from "./agreement.type";

export const requestForNewAgreement = async (
  institutionId: string,
  maxHistoricalDays: number,
  validFor: number,
): Promise<Agreement> => {
  const data = await bankDataApiRequest<{
    id: string;
    created: string;
    institution_id: string;
    max_historical_days: number;
    access_valid_for_days: number;
    access_scope: string[];
    accepted: string;
    reconfirmation: boolean;
  }>({
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

  return {
    id: data.id,
    institutionId: institutionId,
    maxHistoricalDays: maxHistoricalDays,
    validFor: validFor,
    created: new Date(data.created),
    accepted: new Date(data.accepted),
    expirationDate: new Date(
      new Date(data.created).getTime() + validFor * 24 * 60 * 60 * 1000,
    ),
  } as Agreement;
};
