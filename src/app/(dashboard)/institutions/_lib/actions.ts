"use server";
import { getAgreementForInstitution } from "./agreement";

export async function createDataAccess(formData: FormData) {
  const institutionId = formData.get("institutionId") as string;
  const maxDaysAccess = Number.parseInt(
    formData.get("maxDaysAccess") as string,
  );
  const maxTransactionTotalDays = Number.parseInt(
    formData.get("maxTransactionTotalDays") as string,
  );

  const aggreementId = await returnAgreementForInstitution(
    institutionId,
    maxDaysAccess,
    maxTransactionTotalDays,
  );

  console.log("Entered agreement id: ", aggreementId);
}

async function returnAgreementForInstitution(
  institutionId: string,
  maxDaysAccess: number,
  maxTransactionTotalDays: number,
) {
  try {
    return await getAgreementForInstitution(
      institutionId,
      maxDaysAccess,
      maxTransactionTotalDays,
    );
  } catch (error) {
    console.error("Error getting agreement for institution:", error);
    return null;
  }
}
