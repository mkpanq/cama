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
        transactionId?: string;
        entryReference?: string;
        endToEndId?: string;
        mandateId?: string;
        checkId?: string;
        creditorId?: string;
        bookingDate: string;
        valueDate?: string;
        bookingDateTime?: string;
        valueDateTime?: string;
        transactionAmount: {
          amount: string;
          currency: string;
        };
        currencyExchange?: Array<{
          sourceCurrency?: string;
          exchangeRate?: string;
          unitCurrency?: string;
          targetCurrency?: string;
          quotationDate?: string;
          contractIdentification?: string;
        }>;
        creditorName?: string;
        creditorAccount?: {
          iban?: string;
          bban?: string;
          pan?: string;
          maskedPan?: string;
          msisdn?: string;
          currency?: string;
        };
        ultimateCreditor?: string;
        debtorName?: string;
        debtorAccount?: {
          iban?: string;
          bban?: string;
          pan?: string;
          maskedPan?: string;
          msisdn?: string;
          currency?: string;
        };
        ultimateDebtor?: string;
        remittanceInformationUnstructuredArray?: string[];
        remittanceInformationUnstructured?: string;
        remittanceInformationStructured?: string;
        remittanceInformationStructuredArray?: string[];
        additionalInformation?: string;
        purposeCode?: string;
        bankTransactionCode?: string;
        proprietaryBankTransactionCode?: string;
        internalTransactionId: string;
        balanceAfterTransaction?: {
          amount: string;
          currency?: string;
        };
      }[];
      pending?: unknown;
    };
  }>({
    method: "GET",
    path,
    auth: token,
  });

  const convertedData: Transaction[] = data.transactions.booked.map(
    (rawTransaction) => {
      const amount = parseFloat(rawTransaction.transactionAmount.amount);
      return {
        id: rawTransaction.internalTransactionId,
        accountId: accountId,
        bookingDate: new Date(rawTransaction.bookingDate),
        type: amount > 0 ? "INCOMING" : "OUTGOING",
        amount: Math.abs(amount),
        currency: rawTransaction.transactionAmount.currency,
        counterpartyName:
          rawTransaction.creditorName ?? rawTransaction.debtorName ?? null,
        counterpartyIban:
          rawTransaction.creditorAccount?.iban ??
          rawTransaction.debtorAccount?.iban ??
          null,
        transactionCode: rawTransaction.proprietaryBankTransactionCode ?? null,
        description:
          rawTransaction.remittanceInformationUnstructured ??
          (rawTransaction.remittanceInformationUnstructuredArray
            ? rawTransaction.remittanceInformationUnstructuredArray.join("-")
            : null),
        // Extended mapping
        transactionId: rawTransaction.transactionId ?? null,
        entryReference: rawTransaction.entryReference ?? null,
        endToEndId: rawTransaction.endToEndId ?? null,
        mandateId: rawTransaction.mandateId ?? null,
        checkId: rawTransaction.checkId ?? null,
        creditorId: rawTransaction.creditorId ?? null,
        valueDate: rawTransaction.valueDate
          ? new Date(rawTransaction.valueDate)
          : null,
        bookingDateTime: rawTransaction.bookingDateTime
          ? new Date(rawTransaction.bookingDateTime)
          : null,
        valueDateTime: rawTransaction.valueDateTime
          ? new Date(rawTransaction.valueDateTime)
          : null,
        currencyExchange: rawTransaction.currencyExchange ?? null,
        creditorName: rawTransaction.creditorName ?? null,
        creditorAccount: rawTransaction.creditorAccount ?? null,
        ultimateCreditor: rawTransaction.ultimateCreditor ?? null,
        debtorName: rawTransaction.debtorName ?? null,
        debtorAccount: rawTransaction.debtorAccount ?? null,
        ultimateDebtor: rawTransaction.ultimateDebtor ?? null,
        remittanceInformationUnstructured:
          rawTransaction.remittanceInformationUnstructured ?? null,
        remittanceInformationUnstructuredArray:
          rawTransaction.remittanceInformationUnstructuredArray ?? null,
        remittanceInformationStructured:
          rawTransaction.remittanceInformationStructured ?? null,
        remittanceInformationStructuredArray:
          rawTransaction.remittanceInformationStructuredArray ?? null,
        additionalInformation: rawTransaction.additionalInformation ?? null,
        purposeCode: rawTransaction.purposeCode ?? null,
        bankTransactionCode: rawTransaction.bankTransactionCode ?? null,
        proprietaryBankTransactionCode:
          rawTransaction.proprietaryBankTransactionCode ?? null,
        internalTransactionId: rawTransaction.internalTransactionId ?? null,
        balanceAfterTransactionAmount: rawTransaction.balanceAfterTransaction
          ?.amount
          ? Math.abs(parseFloat(rawTransaction.balanceAfterTransaction.amount))
          : null,
        balanceAfterTransactionCurrency:
          rawTransaction.balanceAfterTransaction?.currency ?? null,
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
