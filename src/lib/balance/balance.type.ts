type AccountBalance = {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  currency: string;
  type: string | null;
  referenceDate: Date;
};

export default AccountBalance;
