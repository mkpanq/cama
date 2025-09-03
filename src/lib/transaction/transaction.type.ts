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

export type TransactionApiResponse = {
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
};
