// API-aligned types for account transactions payload

export type CurrencyExchangeSchema = {
  sourceCurrency?: string;
  exchangeRate?: string;
  unitCurrency?: string;
  targetCurrency?: string;
  quotationDate?: string;
  contractIdentification?: string;
};

export type AccountReferenceSchema = {
  iban?: string;
  bban?: string;
  pan?: string;
  maskedPan?: string;
  msisdn?: string;
  currency?: string;
};

export type MonetaryAmountSchema = {
  amount: string;
  currency: string;
};

export type BalanceAfterTransactionSchema = {
  amount: string;
  currency?: string;
};

export type TransactionSchema = {
  transactionId?: string;
  entryReference?: string;
  endToEndId?: string;
  mandateId?: string;
  checkId?: string;
  creditorId?: string;
  bookingDate?: string;
  valueDate?: string;
  bookingDateTime?: string;
  valueDateTime?: string;
  transactionAmount: MonetaryAmountSchema;
  currencyExchange?: CurrencyExchangeSchema[];
  creditorName?: string;
  creditorAccount?: AccountReferenceSchema;
  ultimateCreditor?: string;
  debtorName?: string;
  debtorAccount?: AccountReferenceSchema;
  ultimateDebtor?: string;
  remittanceInformationUnstructured?: string;
  remittanceInformationUnstructuredArray?: string[];
  remittanceInformationStructured?: string;
  remittanceInformationStructuredArray?: string[];
  additionalInformation?: string;
  purposeCode?: string;
  bankTransactionCode?: string;
  proprietaryBankTransactionCode?: string;
  internalTransactionId?: string;
  balanceAfterTransaction?: BalanceAfterTransactionSchema;
};

export type AccountTransactions = {
  transactions: {
    booked?: TransactionSchema[];
    pending?: TransactionSchema[];
  };
  last_updated: string; // date-time
};
