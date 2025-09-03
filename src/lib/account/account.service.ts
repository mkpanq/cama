import "server-only";

import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "../shared/apiToken/apiToken.service";
import bankDataApiRequest from "../shared/bankDataApi.request";
import { getInstitutionDetails } from "../institution/institution.service";
import { bulkSave, getAll, updateLastSyncDate } from "./account.repository";
import type { Account, AccountApiResponse } from "./account.type";

export const saveAccountsToDB = async (
  accounts: Account[],
): Promise<string[]> => {
  const ids = await bulkSave(accounts);
  if (!ids || ids.length === 0)
    throw new Error("Failed to save accounts to DB");

  return ids;
};

export const syncAccount = async (accountId: string) => {
  const id = await updateLastSyncDate(accountId);
  if (!id) throw new Error("Failed to update account sync date");

  return id;
};

export const getAccountList = async (): Promise<Account[]> => {
  return await getAll();
};

export const returnAccountData = async (
  bankConnectionId: string,
  accountId: string,
): Promise<Account> => {
  const accountMetadata = await sendRequstForAccountMetadata(accountId);
  const institutionDetails = await getInstitutionDetails(
    accountMetadata.institution_id,
  );

  return {
    id: accountMetadata.id,
    bankConnectionId: bankConnectionId,
    institutionId: accountMetadata.institution_id,
    institutionName: institutionDetails.name,
    institutionLogoUrl: institutionDetails.logo,
    iban: accountMetadata.iban,
    bban: accountMetadata.bban,
    status: accountMetadata.status,
    ownerName: accountMetadata.owner_name,
    name: accountMetadata.name,
    createdAt: accountMetadata.created
      ? new Date(accountMetadata.created)
      : null,
    lastAccessed: accountMetadata.last_accessed
      ? new Date(accountMetadata.last_accessed)
      : null,
    lastSync: null,
  };
};

const sendRequstForAccountMetadata = async (accountId: string) => {
  const accountData = await bankDataApiRequest<AccountApiResponse>({
    method: "GET",
    path: APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_METADATA(accountId),
    auth: await getCurrentApiToken(),
  });

  return accountData;
};
