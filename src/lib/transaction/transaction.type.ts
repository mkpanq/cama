export type CurrencyExchange = {
  sourceCurrency?: string;
  exchangeRate?: string;
  unitCurrency?: string;
  targetCurrency?: string;
  quotationDate?: string;
  contractIdentification?: string;
};

export type AccountRef = {
  iban?: string;
  bban?: string;
  pan?: string;
  maskedPan?: string;
  msisdn?: string;
  currency?: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  bookingDate: Date;
  type: "OUTGOING" | "INCOMING";
  amount: number;
  currency: string;
  counterpartyName: string | null;
  counterpartyIban: string | null;
  transactionCode: string | null;
  description: string | null;
  // Extended API fields (optional)
  transactionId?: string | null;
  entryReference?: string | null;
  endToEndId?: string | null;
  mandateId?: string | null;
  checkId?: string | null;
  creditorId?: string | null;
  valueDate?: Date | null;
  bookingDateTime?: Date | null;
  valueDateTime?: Date | null;
  currencyExchange?: CurrencyExchange[] | null;
  creditorName?: string | null;
  creditorAccount?: AccountRef | null;
  ultimateCreditor?: string | null;
  debtorName?: string | null;
  debtorAccount?: AccountRef | null;
  ultimateDebtor?: string | null;
  remittanceInformationUnstructured?: string | null;
  remittanceInformationUnstructuredArray?: string[] | null;
  remittanceInformationStructured?: string | null;
  remittanceInformationStructuredArray?: string[] | null;
  additionalInformation?: string | null;
  purposeCode?: string | null;
  bankTransactionCode?: string | null;
  proprietaryBankTransactionCode?: string | null;
  internalTransactionId?: string | null;
  balanceAfterTransactionAmount?: number | null;
  balanceAfterTransactionCurrency?: string | null;
};

export type DisplayedTransaction = Transaction & {
  accountName: string | undefined | null;
  institutionName: string | undefined;
};
