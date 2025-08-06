import {
  getRequisitionFromApi,
  saveRequistionToDB,
} from "@/app/(dashboard)/institutions/_lib/requisition";
import APP_CONFIG from "@/appConfig";
import getDBClient from "@/db/client";
import { accountsTable } from "@/db/schema/account";
import { getCurrentApiToken } from "@/shared/apiToken/apiToken";
import bankDataApiRequest from "@/shared/bankDataApi.request";
import { getCurrentUser } from "@/shared/currentUser";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requisitionId = url.searchParams.get("ref");

    // TODO: Think about better erroring strategy
    if (!requisitionId) return;
    const { requisition, accounts } =
      await getRequisitionFromApi(requisitionId);
    const requsitionId = await saveRequistionToDB(requisition);
    if (!requsitionId) throw new Error("RequsitionId could not be saved");

    // Get and parse data for each account
    const accountsData = await Promise.all(
      accounts.map(async (accountId) => {
        const data = await getAccountInfo(requisitionId, accountId);
        if (!data) throw new Error("Account data could not be fetched");

        return data;
      }),
    );

    const accountIds = await saveAccountsToDB(accountsData);
    if (!accountIds) throw new Error("Account IDs could not be saved");

    console.log("Account IDs saved:", accountIds);
    console.log(
      "Right now we should start downloading all accounts data to DB - transaction, details, balances etc",
    );
  } catch (error) {
    console.error(error);
  }

  redirect(APP_CONFIG.ROUTE_CONFIG.HOME_PATH);
}

const saveAccountsToDB = async (
  accounts: Account[],
): Promise<string[] | null> => {
  const db = await getDBClient();

  try {
    const data = await db
      .insert(accountsTable)
      .values(accounts)
      .returning({ id: accountsTable.id });

    return data.map((acc) => acc.id);
  } catch (error) {
    console.error(error);
    return null;
  }
};

type Account = {
  id: string;
  userId: string;
  requisitionId: string;
  institutionId: string;
  institutionResourceId: string;
  iban: string;
  currency: string;
  bban: string | null;
  status: string | null;
  ownerName: string | null;
  name: string | null;
  product: string | null;
  cashAccountType: string | null;
};

const getAccountInfo = async (
  requisitionId: string,
  accountId: string,
): Promise<Account | null> => {
  try {
    const accountMetadata = await getAccountMetadata(accountId);
    const accountDetails = await getAccountDetails(accountId);

    if (!accountMetadata || !accountDetails)
      throw new Error("Could not fetch account metadata or details");

    const currentUser = await getCurrentUser();

    return {
      id: accountMetadata.id,
      userId: currentUser.id,
      requisitionId: requisitionId,
      institutionId: accountMetadata.institution_id,
      institutionResourceId: accountDetails.account.resourceId,
      iban: accountMetadata.iban,
      currency: accountDetails.account.currency,
      bban: accountMetadata.bban,
      status: accountMetadata.status,
      ownerName: accountMetadata.owner_name || accountDetails.account.ownerName,
      name: accountMetadata.name || accountDetails.account.name,
      product: accountDetails.account.product,
      cashAccountType: accountDetails.account.cashAccountType,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAccountMetadata = async (accountId: string) => {
  try {
    const data = bankDataApiRequest<{
      id: string;
      created: string;
      last_accessed: string;
      iban: string;
      institution_id: string;
      status: string;
      owner_name: string | null;
      bban: string | null;
      name: string;
    }>({
      method: "GET",
      path: APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_METADATA(accountId),
      auth: await getCurrentApiToken(),
    });

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAccountDetails = async (accountId: string) => {
  try {
    const data = bankDataApiRequest<{
      account: {
        resourceId: string;
        iban: string;
        currency: string;
        ownerName: string;
        name: string;
        product: string;
        cashAccountType: string;
      };
    }>({
      method: "GET",
      path: APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_DETAILS(accountId),
      auth: await getCurrentApiToken(),
    });

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
