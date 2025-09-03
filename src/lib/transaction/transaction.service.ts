import "server-only";

import APP_CONFIG from "../appConfig";
import bankDataApiRequest from "../shared/bankDataApi.request";
import type { Transaction, TransactionApiResponse } from "./transaction.type";
import type { DisplayedTransaction } from "./transaction.type";
import type { ErrorResponse } from "../shared/bankDataApi.type";
import { getAll, saveAll } from "./transaction.repository";

export const getBookedTransactionsDataFromAPI = async (
  accountId: string,
  token: string,
): Promise<Transaction[]> => {
  const responseData = await bankDataApiRequest<TransactionApiResponse>({
    method: "GET",
    path: APP_CONFIG.API_CONFIG.API_URL_GET_ACCOUNT_TRANSACTIONS(accountId),
    auth: token,
  });

  if (!responseData.ok) {
    const errorMessage = JSON.stringify(responseData.data as ErrorResponse);
    throw new Error(`Failed to retrieve transactions: ${errorMessage}`);
  }

  const convertedData: Transaction[] = (
    responseData.data as TransactionApiResponse
  ).transactions.booked.map((rawTransaction) => {
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
  });

  return convertedData;
};

export const saveTransactionsDataToDB = async (transactions: Transaction[]) => {
  return await saveAll(transactions);
};

export const getAllTransactions = async (): Promise<DisplayedTransaction[]> => {
  const dbTransactions = await getAll();

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
        description:
          dbTransaction.transactions.description ??
          dbTransaction.transactions.creditorName ??
          dbTransaction.transactions.debtorName,
      };
    },
  );

  return transactions;
};
