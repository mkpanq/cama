import APP_CONFIG from "@/appConfig";
import getDBClient from "@/db/client";
import { agreementsTable } from "@/db/schema/agreement";
import { getCurrentApiToken } from "@/shared/apiToken/apiToken";
import bankDataApiRequest from "@/shared/bankDataApi.request";
import { getCurrentUser } from "@/shared/currentUser";
import { eq } from "drizzle-orm";
import type Agreement from "./agreement.type";
import "server-only";

export const getAgreementForInstitution = async (
  institutionId: string,
  maxDaysAccess: number,
  maxTransactionTotalDays: number,
): Promise<string> => {
  const currentAgreementId =
    await getAgreementForInstitutionFromDB(institutionId);
  if (currentAgreementId) return currentAgreementId;

  const newAgreement = await createNewAgreement(
    institutionId,
    maxTransactionTotalDays,
    maxDaysAccess,
  );

  if (!newAgreement) throw new Error("Failed to create agreement");

  const newAgreementId = await saveAgreementToDB(newAgreement);
  if (!newAgreementId) throw new Error("Failed to save agreement to DB");

  return newAgreementId;
};

const getAgreementForInstitutionFromDB = async (
  institutionId: string,
): Promise<string | null> => {
  const db = await getDBClient();

  const agreementId = await db
    .select({
      agreementId: agreementsTable.id,
    })
    .from(agreementsTable)
    .where(eq(agreementsTable.institutionId, institutionId))
    .limit(1);

  if (agreementId.length > 0) {
    return agreementId[0].agreementId;
  } else {
    return null;
  }
};

const createNewAgreement = async (
  institutionId: string,
  maxHistoricalDays: number,
  validFor: number,
): Promise<Agreement | null> => {
  try {
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

    const currentUser = await getCurrentUser();

    return {
      id: data.id,
      userId: currentUser.id,
      institutionId: institutionId,
      maxHistoricalDays: maxHistoricalDays,
      validFor: validFor,
      created: new Date(data.created),
      accepted: new Date(data.accepted),
    } as Agreement;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const saveAgreementToDB = async (
  agreement: Agreement,
): Promise<string | null> => {
  const db = await getDBClient();

  try {
    const data = await db
      .insert(agreementsTable)
      .values(agreement)
      .returning({ id: agreementsTable.id });

    return data[0].id;
  } catch (error) {
    console.error(error);
    return null;
  }
};
