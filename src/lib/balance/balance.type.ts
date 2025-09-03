export type AccountBalance = {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: string | null;
  referenceDate: Date | null;
  creditLimitIncluded: boolean | null;
  lastChangeDateTime: Date | null;
  lastCommittedTransaction: string | null;
};

export type AccountBalanceApiResponse = {
  balances: {
    balanceAmount: {
      amount: string;
      currency: string;
    };
    balanceType: string;
    creditLimitIncluded?: boolean;
    lastChangeDateTime?: string;
    referenceDate?: string;
    lastCommittedTransaction?: string;
  }[];
};
