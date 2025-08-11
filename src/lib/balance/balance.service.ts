import "server-only";
import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import type AccountBalance from "./balance.type";
import {
  getBalanceForCurrentUser,
  saveBalanceDataToDB,
} from "./balance.repository";

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

export const saveBalanceData = async (balances: AccountBalance[]) => {
  const savedBalanacesIds = await saveBalanceDataToDB(balances);
  return savedBalanacesIds;
};

export const returnBalanceStatsData = async (): Promise<{
  totalBalancesByCurrency: Record<string, number>;
}> => {
  const balancesData = await getBalanceForCurrentUser();

  const groupedByCurrency = balancesData.reduce(
    (acc, balance) => {
      if (!acc[balance.currency]) {
        acc[balance.currency] = [];
      }
      acc[balance.currency].push(balance);
      return acc;
    },
    {} as Record<string, AccountBalance[]>,
  );

  const totalBalancesByCurrency = Object.keys(groupedByCurrency).reduce(
    (acc, currency) => {
      const balancesForCurrency = groupedByCurrency[currency];
      const totalForCurrency = balancesForCurrency.reduce(
        (sum, balance) => sum + balance.amount,
        0,
      );
      acc[currency] = totalForCurrency;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    totalBalancesByCurrency,
  };
};
