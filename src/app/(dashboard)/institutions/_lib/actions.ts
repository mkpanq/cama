"use server";

import { redirect } from "next/navigation";
import { requestForRequisition } from "../../../../lib/bankConnection/requisition/requisition.service";
import {
  deleteBankConnection,
  initializeBankConnection,
  updateRequisitionIdForBankConnection,
} from "@/lib/bankConnection/bankConnection.service";
import APP_CONFIG from "@/lib/appConfig";

export async function createBankConnection(formData: FormData) {
  const institutionId = formData.get("institutionId") as string;
  const maxDaysAccess = Number.parseInt(
    formData.get("maxDaysAccess") as string,
  );
  const maxTransactionTotalDays = Number.parseInt(
    formData.get("maxTransactionTotalDays") as string,
  );

  const bankConnection = await initializeBankConnection(
    institutionId,
    maxTransactionTotalDays,
    maxDaysAccess,
  );
  const inititalRequisition = await requestForRequisition(bankConnection);

  if (!bankConnection || !inititalRequisition)
    throw new Error(
      "Failed to create initital bank connection with requisition",
    );

  await updateRequisitionIdForBankConnection(
    bankConnection.id,
    inititalRequisition.requisitionId,
  );

  redirect(inititalRequisition.redirectLink);
}

export async function removeBankConnection(formData: FormData) {
  const institutionId = formData.get("institutionId") as string;
  const bankConnectionId = formData.get("bankConnectionId") as string;

  const deletedId = await deleteBankConnection(bankConnectionId, institutionId);
  console.log(`Deleted Bank Connection ID: ${deletedId}`);

  redirect(APP_CONFIG.ROUTE_CONFIG.INSTITUTIONS_PATH);
}
