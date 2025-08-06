import {
  getRequisitionFromApi,
  saveRequistionToDB,
} from "@/lib/requisition/requisition.service";
import APP_CONFIG from "@/lib/appConfig";
import { redirect } from "next/navigation";
import {
  getAccountInfo,
  saveAccountsToDB,
} from "@/lib/account/account.service";

// TODO: Think about better erroring strategy
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requisitionId = url.searchParams.get("ref");
    if (!requisitionId) return;

    const { savedRequisitionId, accounts } =
      await getAndSaveRequisition(requisitionId);

    const savedAccountsIds = await getAndSaveAccounts(
      accounts,
      savedRequisitionId,
    );
    if (!savedAccountsIds) throw new Error("Account IDs could not be saved");

    console.log("Account IDs saved:", savedAccountsIds);
    console.log(
      "Right now we should start downloading all accounts data to DB - transaction, details, balances etc",
    );
  } catch (error) {
    console.error(error);
  }

  redirect(APP_CONFIG.ROUTE_CONFIG.HOME_PATH);
}

const getAndSaveRequisition = async (requisitionId: string) => {
  const { requisition, accounts } = await getRequisitionFromApi(requisitionId);
  const savedRequisitionId = await saveRequistionToDB(requisition);
  if (!savedRequisitionId) throw new Error("RequsitionId could not be saved");

  return { savedRequisitionId, accounts };
};

const getAndSaveAccounts = async (
  accounts: string[],
  savedRequisitionId: string,
) => {
  const accountsData = await Promise.all(
    accounts.map(async (accountId) => {
      const data = await getAccountInfo(savedRequisitionId, accountId);
      if (!data) throw new Error("Account data could not be fetched");

      return data;
    }),
  );
  const accountIds = await saveAccountsToDB(accountsData);

  return accountIds;
};
