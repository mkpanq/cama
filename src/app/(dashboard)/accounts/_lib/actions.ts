"use server";

import { addAccountBalanceDataRetrivalJob } from "@/jobs/getAccountBalances.job";
import { addAccountTransactionDataRetrivalJob } from "@/jobs/getAccountTransactions.job";

export const updateAccountData = async (formData: FormData) => {
  const accountId = formData.get("accountId") as string;
  await addAccountBalanceDataRetrivalJob(accountId);
  await addAccountTransactionDataRetrivalJob(accountId);
};
