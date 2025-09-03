import "server-only";
import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import {
  getBalanceForCurrentUser,
  saveBalanceDataToDB,
} from "./balance.repository";
import type { AccountBalance, AccountBalanceApiResponse } from "./balance.type";
import type { ErrorResponse } from "../shared/bankDataApi.type";

export const getBalanceDataFromAPI = async (
  accountId: string,
  token: string,
): Promise<AccountBalance[]> => {
  const responseData = await bankDataApiRequest<AccountBalanceApiResponse>({
    method: "GET",
    path: APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_BALANCES(accountId),
    auth: token,
  });

  if (!responseData.ok) {
    const errorMessage = JSON.stringify(responseData.data as ErrorResponse);
    throw new Error(`Failed to get balance: ${errorMessage}`);
  }

  const accountBalances: AccountBalance[] = (
    responseData.data as AccountBalanceApiResponse
  ).balances.map((balance) => ({
    id: crypto.randomUUID(),
    accountId: accountId,
    amount: parseFloat(balance.balanceAmount.amount),
    currency: balance.balanceAmount.currency,
    type: balance.balanceType,
    referenceDate: balance.referenceDate
      ? new Date(balance.referenceDate)
      : null,
    creditLimitIncluded: balance.creditLimitIncluded ?? null,
    lastChangeDateTime: balance.lastChangeDateTime
      ? new Date(balance.lastChangeDateTime)
      : null,
    lastCommittedTransaction: balance.lastCommittedTransaction ?? null,
  }));

  return accountBalances;
};

export const saveBalanceData = async (balances: AccountBalance[]) => {
  const savedBalanacesIds = await saveBalanceDataToDB(balances);
  return savedBalanacesIds;
};

// TODO: Add currency handling
export const returnBalanceTotals = async (): Promise<{
  currency: string;
  total: number;
}> => {
  const balancesData = await getBalanceForCurrentUser();
  const total = balancesData.reduce((acc, balance) => acc + balance.amount, 0);
  return {
    currency: balancesData[0]?.currency,
    total,
  };
};

export const getBalancesList = async (): Promise<AccountBalance[]> => {
  const balancesData = await getBalanceForCurrentUser();

  return balancesData;
};
