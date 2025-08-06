"use server";

import { redirect } from "next/navigation";
import { getAgreementForInstitution } from "../../../../lib/agreement/agreement.service";
import { requestForRequisition } from "../../../../lib/requisition/requisition.service";

export async function createDataAccess(formData: FormData) {
  const { institutionId, maxDaysAccess, maxTransactionTotalDays } =
    parseInstitutionData(formData);

  const aggreementId = await returnAgreementForInstitution(
    institutionId,
    maxDaysAccess,
    maxTransactionTotalDays,
  );
  if (!aggreementId) throw new Error("AgreementId could not be found");

  console.log("Entered agreement id: ", aggreementId);

  const requisitionRedirectLink = await requestForRequisition(
    institutionId,
    aggreementId,
  );
  if (!requisitionRedirectLink)
    throw new Error("Requisition could not be requested");

  redirect(requisitionRedirectLink);
}

const parseInstitutionData = (
  formData: FormData,
): {
  institutionId: string;
  maxDaysAccess: number;
  maxTransactionTotalDays: number;
} => {
  const institutionId = formData.get("institutionId") as string;
  const maxDaysAccess = Number.parseInt(
    formData.get("maxDaysAccess") as string,
  );
  const maxTransactionTotalDays = Number.parseInt(
    formData.get("maxTransactionTotalDays") as string,
  );

  return { institutionId, maxDaysAccess, maxTransactionTotalDays };
};

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
