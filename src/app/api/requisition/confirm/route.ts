import APP_CONFIG from "@/lib/appConfig";
import { redirect } from "next/navigation";
import {
  getExistingBankConnectionViaReferenceId,
  updateRequisitionCreationDateForBankConnection,
} from "@/lib/bankConnection/bankConnection.service";
import { returnExisitingRequisitionDetails } from "@/lib/bankConnection/requisition/requisition.service";
import {
  returnAccountData,
  saveAccountsToDB,
} from "@/lib/account/account.service";

export async function GET(request: Request) {
  try {
    const referenceId = getReferenceIdFromURL(request.url);
    if (!referenceId) throw new Error("No reference ID found in URL");

    const currentBankConnection =
      await getExistingBankConnectionViaReferenceId(referenceId);

    const requisitionData = await returnExisitingRequisitionDetails(
      currentBankConnection.requisitionId,
    );
    if (!requisitionData)
      throw new Error(
        `No requisition details found for specific id: ${currentBankConnection.requisitionId}`,
      );

    await updateRequisitionCreationDateForBankConnection(
      currentBankConnection.id,
      requisitionData.createdAt,
    );

    const savedAccountsIds = await getAndSaveAccounts(
      requisitionData.accounts,
      currentBankConnection.id,
    );
    if (!savedAccountsIds) throw new Error("Account IDs could not be saved");
  } catch (error) {
    console.error(error);
  }

  redirect(APP_CONFIG.ROUTE_CONFIG.HOME_PATH);
}

const getReferenceIdFromURL = (url: string): string | null => {
  const urlObject = new URL(url);
  const referenceId = urlObject.searchParams.get("ref");
  return referenceId;
};

const getAndSaveAccounts = async (
  accounts: string[],
  bankConnectionId: string,
) => {
  const accountsData = await Promise.all(
    accounts.map(async (accountId) => {
      const data = await returnAccountData(bankConnectionId, accountId);
      if (!data) throw new Error("Account data could not be fetched");

      return data;
    }),
  );

  const accountIds = await saveAccountsToDB(accountsData);
  return accountIds;
};
