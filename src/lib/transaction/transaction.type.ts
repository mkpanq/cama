type Transaction = {
  id: string;
  accountId: string;
  userId: string;
  bookingDate: Date;
  type: "OUTGOING" | "INCOMING";
  amount: number;
  currency: string;
  counterpartyDetails: {
    name: string;
    iban: string;
  };
  transactionCode: string;
  description: string;
};

export default Transaction;
