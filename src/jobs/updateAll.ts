import { getAccountList } from "@/lib/account/account.service";
import { addAccountBalanceDataRetrivalJob } from "./getAccountBalances.job";
import { addAccountTransactionDataRetrivalJob } from "./getAccountTransactions.job";
import "server-only";

export const updateAll = async () => {
  const accounts = await getAccountList();
  const accountsIds = accounts.map((account) => account.id);

  accountsIds.forEach(async (id) => await addAccountBalanceDataRetrivalJob(id));

  accountsIds.forEach(
    async (id) => await addAccountTransactionDataRetrivalJob(id),
  );
};
