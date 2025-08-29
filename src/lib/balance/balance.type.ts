type AccountBalance = {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: string | null;
  referenceDate: Date;
  creditLimitIncluded: boolean | null;
  lastChangeDateTime: Date | null;
  lastCommittedTransaction: string | null;
};

export default AccountBalance;
