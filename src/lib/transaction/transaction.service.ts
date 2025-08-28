import "server-only";

import getDBClient from "@/db/client";
import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import type { Transaction } from "./transaction.type";
import { transactionsTable } from "@/db/schema/transaction";
import { eq, desc, gte } from "drizzle-orm";
import { accountsTable } from "@/db/schema/account";
import type { DisplayedTransaction } from "./transaction.type";
import type {
  AccountTransactions,
  TransactionSchema,
} from "./transaction.api.types";

export const getBookedTransactionsDataFromAPI = async (
  accountId: string,
  token: string,
): Promise<Transaction[]> => {
  const path =
    APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_TRANSACTIONS(accountId);

  const data = await bankDataApiRequest<AccountTransactions>({
    method: "GET",
    path,
    auth: token,
  });

  const booked: TransactionSchema[] = data.transactions.booked ?? [];

  const convertedData: Transaction[] = booked.map((raw) => {
    const amountStr = raw.transactionAmount.amount ?? "0";
    const amountNum = parseFloat(amountStr);

    return {
      id: raw.internalTransactionId ?? raw.transactionId ?? cryptoRandomId(),
      accountId,
      bookingDate: new Date(
        raw.bookingDateTime ?? raw.bookingDate ?? new Date().toISOString(),
      ),
      type: amountNum > 0 ? "INCOMING" : "OUTGOING",
      amount: Math.abs(amountNum),
      currency: raw.transactionAmount.currency,
      counterpartyName: raw.creditorName ?? raw.debtorName ?? null,
      counterpartyIban:
        raw.creditorAccount?.iban ?? raw.debtorAccount?.iban ?? null,
      transactionCode: raw.proprietaryBankTransactionCode ?? null,
      description:
        raw.remittanceInformationUnstructured ??
        (raw.remittanceInformationUnstructuredArray ?? []).join("-") ??
        null,
    };
  });

  return convertedData;
};

// Small helper to generate a stable-ish ID if API misses internalTransactionId
const cryptoRandomId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

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
