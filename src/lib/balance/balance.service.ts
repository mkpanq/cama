import "server-only";
import getDBClient from "@/db/client";
import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import type AccountBalance from "./balance.type";
import { balancesTable } from "@/db/schema/balance";

// TODO: We should create separate "Job Method wrapper" to identify why some requests
// Need to have tokena and current user passed as an argument, instead of getting parsed
// from the method itself
export const getBalanceDataFromAPI = async (
  accountId: string,
  userId: string,
  token: string,
): Promise<AccountBalance[]> => {
  const data = await bankDataApiRequest<{
    balances: {
      balanceAmount: {
        amount: string;
        currency: string;
      };
      balanceType: string;
      referenceDate: string;
    }[];
  }>({
    method: "GET",
    path: APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_BALANCES(accountId),
    auth: token,
  });

  const accountBalances: AccountBalance[] = data.balances.map((balance) => ({
    id: crypto.randomUUID(),
    userId: userId,
    accountId: accountId,
    amount: parseFloat(balance.balanceAmount.amount),
    currency: balance.balanceAmount.currency,
    type: balance.balanceType,
    referenceDate: new Date(balance.referenceDate),
  }));

  return accountBalances;
};

export const saveBalanceDataToDB = async (balances: AccountBalance[]) => {
  const db = await getDBClient();

  const data = await db
    .insert(balancesTable)
    .values(balances)
    .returning({ id: balancesTable.id });

  return data.map((balance) => balance.id);
};
