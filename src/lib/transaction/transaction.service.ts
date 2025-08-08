// TODO: We should create separate "Job Method wrapper" to identify why some requests
// Need to have tokena and current user passed as an argument, instead of getting parsed
// from the method itself

import getDBClient from "@/db/client";
import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import type Transaction from "./transaction.type";
import { transactionsTable } from "@/db/schema/transaction";

export const getBookedTransactionsDataFromAPI = async (
  accountId: string,
  userId: string,
  token: string,
  maxHistoricalDays: number | null,
): Promise<Transaction[]> => {
  let path = APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_TRANSACTIONS(accountId);

  if (maxHistoricalDays) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - maxHistoricalDays);

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    path = `${path}?date_from=${formattedStartDate}&date_to=${formattedEndDate}`;
  }

  const data = await bankDataApiRequest<{
    transactions: {
      booked: {
        transactionId: string;
        bookingDate: string;
        transactionAmount: {
          amount: string;
          currency: string;
        };
        debtorName: string;
        debtorAccount: {
          iban: string;
        };
        creditorName: string;
        creditorAccount: {
          iban: string;
        };
        remittanceInformationUnstructured: string;
        proprietaryBankTransactionCode: string;
        internalTransactionId: string;
      }[];
    };
  }>({
    method: "GET",
    path,
    auth: token,
  });

  const convertedData: Transaction[] = data.transactions.booked.map(
    (rawTransaction) => {
      return {
        id: rawTransaction.transactionId,
        accountId: accountId,
        userId: userId,
        internalTransactionId: rawTransaction.internalTransactionId,
        bookingDate: new Date(rawTransaction.bookingDate),
        type:
          parseFloat(rawTransaction.transactionAmount.amount) > 0
            ? "INCOMING"
            : "OUTGOING",
        amount: Math.abs(parseFloat(rawTransaction.transactionAmount.amount)),
        currency: rawTransaction.transactionAmount.currency,
        counterpartyDetails: {
          // I assume that only creditor or deptor data could be in single object
          name: rawTransaction.creditorName ?? rawTransaction.debtorName,
          iban:
            rawTransaction.creditorAccount?.iban ??
            rawTransaction.debtorAccount?.iban,
        },
        transactionCode: rawTransaction.proprietaryBankTransactionCode,
        description: rawTransaction.remittanceInformationUnstructured,
      };
    },
  );

  return convertedData;
};

export const saveTransactionsDataToDB = async (transactions: Transaction[]) => {
  const db = await getDBClient();

  const data = await db
    .insert(transactionsTable)
    .values(transactions)
    .onConflictDoNothing({
      target: transactionsTable.id,
    })
    .returning({ id: transactionsTable.id });

  return data.map((transaction) => transaction.id);
};
