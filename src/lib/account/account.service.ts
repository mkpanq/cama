import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import getDBClient from "@/db/client";
import { accountsTable } from "@/db/schema/account";
import { getCurrentApiToken } from "../shared/apiToken/apiToken.service";
import bankDataApiRequest from "../shared/bankDataApi.request";
import { getCurrentUser } from "../shared/getCurrentUser";
import type Account from "./account.type";

export const saveAccountsToDB = async (
  accounts: Account[],
): Promise<string[]> => {
  const db = await getDBClient();

  const data = await db
    .insert(accountsTable)
    .values(accounts)
    .returning({ id: accountsTable.id });

  return data.map((acc) => acc.id);
};

export const getAccountInfo = async (
  bankConnectionId: string,
  accountId: string,
): Promise<Account> => {
  const accountMetadata = await getAccountMetadata(accountId);
  const accountDetails = await getAccountDetails(accountId);
  const currentUser = await getCurrentUser();

  return {
    id: accountMetadata.id,
    userId: currentUser.id,
    bankConnectionId: bankConnectionId,
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
};

const getAccountMetadata = async (accountId: string) => {
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
};

const getAccountDetails = async (accountId: string) => {
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
};
