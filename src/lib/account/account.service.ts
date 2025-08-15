import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import getDBClient from "@/db/client";
import { accountsTable } from "@/db/schema/account";
import { getCurrentApiToken } from "../shared/apiToken/apiToken.service";
import bankDataApiRequest from "../shared/bankDataApi.request";
import { getCurrentUser } from "../shared/supabaseServerClient";
import type Account from "./account.type";
import { bankConnectionTable } from "@/db/schema/bankConnection";
import { eq } from "drizzle-orm";
import { getInstitutionDetails } from "../institution/institution.service";

export const saveAccountsToDB = async (
  accounts: Account[],
): Promise<string[]> => {
  const db = getDBClient();

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
  const institutionDetails = await getInstitutionDetails(
    accountMetadata.institution_id,
  );
  const currentUser = await getCurrentUser();

  return {
    id: accountMetadata.id,
    userId: currentUser.id,
    bankConnectionId: bankConnectionId,
    institutionId: accountMetadata.institution_id,
    institutionName: institutionDetails.name,
    institutionLogoUrl: institutionDetails.logo,
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

// TODO: Needs refactor - rather save historical days together with the accounts table rather than making such joins
export const getMaxHistoricalDays = async (
  accountId: string,
): Promise<number | null> => {
  const db = getDBClient();

  const data = await db
    .select({ maxDays: bankConnectionTable.maxHistoricalDays })
    .from(accountsTable)
    .where(eq(accountsTable.id, accountId))
    .leftJoin(
      bankConnectionTable,
      eq(accountsTable.bankConnectionId, bankConnectionTable.id),
    );

  return data[0].maxDays;
};

export const getAccountList = async (): Promise<Account[]> => {
  const db = getDBClient();
  const { id } = await getCurrentUser();

  const data = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.userId, id));

  return data;
};
