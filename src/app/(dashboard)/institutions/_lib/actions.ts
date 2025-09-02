"use server";

import { redirect } from "next/navigation";
import { returnNewRequisition } from "../../../../lib/bankConnection/requisition/requisition.service";
import { initializeBankConnectionWithAgreement } from "@/lib/bankConnection/bankConnection.service";
import APP_CONFIG from "@/lib/appConfig";
import { updateRequisitionId } from "@/lib/bankConnection/bankConnection.repository";

export async function createBankConnection(formData: FormData) {
  const { requestedInstitutionId, maxDaysAccess, maxTransactionTotalDays } =
    getFormDataForCreation(formData);

  const { institutionId, agreementId, referenceId } =
    await initializeBankConnectionWithAgreement(
      requestedInstitutionId,
      maxTransactionTotalDays,
      maxDaysAccess,
    );

  const inititalRequisition = await returnNewRequisition(
    institutionId,
    agreementId,
    referenceId,
  );

  if (!inititalRequisition)
    throw new Error(
      "Failed to create initital bank connection: Cannot create new requisition",
    );

  const requisitionId = await updateRequisitionId(
    referenceId,
    inititalRequisition.id,
  );

  if (!requisitionId)
    throw new Error(
      "Cannot save requisition id to new bank connection - DB error during saving",
    );

  redirect(inititalRequisition.redirectUrl);
}

export async function removeBankConnection(formData: FormData) {
  const bankConnectionId = formData.get("bankConnectionId") as string;

  const deletedId = await deleteBankConnection(bankConnectionId);
  console.log(`Deleted Bank Connection ID: ${deletedId}`);

  redirect(APP_CONFIG.ROUTE_CONFIG.HOME_PATH);
}

const getFormDataForCreation = (formData: FormData) => {
  const requestedInstitutionId = formData.get("institutionId") as string;
  const maxDaysAccess = Number.parseInt(
    formData.get("maxDaysAccess") as string,
  );
  const maxTransactionTotalDays = Number.parseInt(
    formData.get("maxTransactionTotalDays") as string,
  );

  return {
    requestedInstitutionId,
    maxDaysAccess,
    maxTransactionTotalDays,
  };
};
