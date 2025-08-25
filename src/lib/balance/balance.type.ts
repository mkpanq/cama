type AccountBalance = {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: string | null;
  referenceDate: Date;
};

export default AccountBalance;
