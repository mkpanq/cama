"use server";

import { redirect } from "next/navigation";
import { requestForRequisition } from "../../../../lib/bankConnection/requisition/requisition.service";
import {
  initializeBankConnection,
  updateRequisitionIdForBankConnection,
} from "@/lib/bankConnection/bankConnection.service";

export async function createBankConnection(formData: FormData) {
  const { institutionId, maxDaysAccess, maxTransactionTotalDays } =
    parseInstitutionData(formData);

  const bankConnection = await initializeBankConnection(
    institutionId,
    maxTransactionTotalDays,
    maxDaysAccess,
  );

  console.log("Bank connection initialized successfully", bankConnection);
  const inititalRequisition = await requestForRequisition(bankConnection);
  if (!inititalRequisition)
    throw new Error("Failed to request initial requisition");

  await updateRequisitionIdForBankConnection(
    bankConnection.id,
    inititalRequisition.requisitionId,
  );

  console.log("Requisition created successfully", inititalRequisition);
  const redirectLink = inititalRequisition.redirectLink;

  redirect(redirectLink);
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
