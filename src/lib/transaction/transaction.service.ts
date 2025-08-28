import "server-only";

import getDBClient from "@/db/client";
import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import type { Transaction } from "./transaction.type";
import { transactionsTable } from "@/db/schema/transaction";
import { eq, desc, gte } from "drizzle-orm";
import { accountsTable } from "@/db/schema/account";
import type { DisplayedTransaction } from "./transaction.type";

export const getBookedTransactionsDataFromAPI = async (
  accountId: string,
  token: string,
): Promise<Transaction[]> => {
  const path =
    APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_TRANSACTIONS(accountId);

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
        remittanceInformationUnstructuredArray: string[];
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
        bookingDate: new Date(rawTransaction.bookingDate),
        type:
          parseFloat(rawTransaction.transactionAmount.amount) > 0
            ? "INCOMING"
            : "OUTGOING",
        amount: Math.abs(parseFloat(rawTransaction.transactionAmount.amount)),
        currency: rawTransaction.transactionAmount.currency,
        counterpartyName:
          rawTransaction.creditorName ?? rawTransaction.debtorName,
        counterpartyIban:
          rawTransaction.creditorAccount?.iban ??
          rawTransaction.debtorAccount?.iban,
        transactionCode: rawTransaction.proprietaryBankTransactionCode,
        description:
          rawTransaction.remittanceInformationUnstructured ??
          rawTransaction.remittanceInformationUnstructuredArray.join("-"),
      };
    },
  );

  return convertedData;
};

export const saveTransactionsDataToDB = async (transactions: Transaction[]) => {
  const db = getDBClient();

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
  const db = getDBClient();

  // Fetch transactions from the database
  const dbTransactions = await db
    .select()
    .from(transactionsTable)
    .where(
      gte(
        transactionsTable.bookingDate,
        new Date(new Date().setDate(new Date().getDate() - 30)),
      ),
    )
    .orderBy(desc(transactionsTable.bookingDate))
    .leftJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id));

  // Convert each dbTransaction to a Transaction type
  const transactions: DisplayedTransaction[] = dbTransactions.map(
    (dbTransaction) => {
      return {
        id: dbTransaction.transactions.id,
        accountId: dbTransaction.transactions.accountId,
        accountName: dbTransaction.accounts?.name,
        institutionName: dbTransaction.accounts?.institutionName,
        bookingDate: new Date(dbTransaction.transactions.bookingDate),
        type: dbTransaction.transactions.type,
        amount: dbTransaction.transactions.amount,
        currency: dbTransaction.transactions.currency,
        counterpartyName: dbTransaction.transactions.counterpartyName,
        counterpartyIban: dbTransaction.transactions.counterpartyIban,
        transactionCode: dbTransaction.transactions.transactionCode,
        description: dbTransaction.transactions.description,
      };
    },
  );

  return transactions;
};
