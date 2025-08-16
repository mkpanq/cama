import "server-only";
import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import type AccountBalance from "./balance.type";
import {
  getBalanceForCurrentUser,
  saveBalanceDataToDB,
} from "./balance.repository";

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
