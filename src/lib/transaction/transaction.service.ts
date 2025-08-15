// TODO: We should create separate "Job Method wrapper" to identify why some requests
// Need to have tokena and current user passed as an argument, instead of getting parsed
// from the method itself
import "server-only";

import getDBClient from "@/db/client";
import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import type Transaction from "./transaction.type";
import { transactionsTable } from "@/db/schema/transaction";
import { getCurrentUser } from "../shared/supabaseServerClient";
import { eq } from "drizzle-orm";
import { accountsTable } from "@/db/schema/account";
import type { DisplayedTransaction } from "./transaction.type";

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
        id: rawTransaction.internalTransactionId,
        accountId: accountId,
        userId: userId,
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

export const getAllTransactions = async (): Promise<DisplayedTransaction[]> => {
  const db = await getDBClient();
  const { id } = await getCurrentUser();

  // Fetch transactions from the database
  const dbTransactions = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, id))
    .leftJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id));

  // Convert each dbTransaction to a Transaction type
  const transactions: DisplayedTransaction[] = dbTransactions.map(
    (dbTransaction) => {
      return {
        id: dbTransaction.transactions.id,
        accountId: dbTransaction.transactions.accountId,
        accountName: dbTransaction.accounts?.name,
        institutionName: dbTransaction.accounts?.institutionName,
        userId: dbTransaction.transactions.userId,
        bookingDate: new Date(dbTransaction.transactions.bookingDate),
        type: dbTransaction.transactions.type,
        amount: dbTransaction.transactions.amount,
        currency: dbTransaction.transactions.currency,
        counterpartyDetails: {
          name: dbTransaction.transactions.counterpartyName,
          iban: dbTransaction.transactions.counterpartyIban,
        },
        transactionCode: dbTransaction.transactions.transactionCode,
        description: dbTransaction.transactions.description,
      };
    },
  );

  return transactions;
};
