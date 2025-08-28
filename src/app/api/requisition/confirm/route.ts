import { getRequisitionFromApi } from "@/lib/bankConnection/requisition/requisition.service";
import APP_CONFIG from "@/lib/appConfig";
import { redirect } from "next/navigation";
import {
  getAccountInfo,
  saveAccountsToDB,
} from "@/lib/account/account.service";
import {
  getBankConnectionViaReferenceId,
  updateRequisitionCreationDateForBankConnection,
} from "@/lib/bankConnection/bankConnection.service";
import { addAccountBalanceDataRetrivalJob } from "@/jobs/getAccountBalances.job";
import { addAccountTransactionDataRetrivalJob } from "@/jobs/getAccountTransactions.job";

export async function GET(request: Request) {
  try {
    const referenceId = getReferenceIdFromURL(request.url);
    if (!referenceId) throw new Error("No reference ID found in URL");

    const currentBankConnection =
      await getBankConnectionViaReferenceId(referenceId);
    if (!currentBankConnection)
      throw new Error("Related bank connection not found");

    const { requisitionDetails, accounts } = await getRequisitionFromApi(
      currentBankConnection.requisitionId,
    );

    await updateRequisitionCreationDateForBankConnection(
      currentBankConnection.id,
      requisitionDetails.created,
    );

    const savedAccountsIds = await getAndSaveAccounts(
      accounts,
      currentBankConnection.id,
    );
    if (!savedAccountsIds) throw new Error("Account IDs could not be saved");

    // savedAccountsIds.forEach(
    //   async (id) => await addAccountBalanceDataRetrivalJob(id),
    // );

    // savedAccountsIds.forEach(
    //   async (id) => await addAccountTransactionDataRetrivalJob(id),
    // );
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
      const data = await getAccountInfo(bankConnectionId, accountId);
      if (!data) throw new Error("Account data could not be fetched");

      return data;
    }),
  );
  const accountIds = await saveAccountsToDB(accountsData);

  return accountIds;
};
