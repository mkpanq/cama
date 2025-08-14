type Transaction = {
  id: string;
  accountId: string;
  userId: string;
  bookingDate: Date;
  type: "OUTGOING" | "INCOMING";
  amount: number;
  currency: string;
  counterpartyDetails: {
    name: string | null;
    iban: string | null;
  };
  transactionCode: string | null;
  description: string | null;
};

export default Transaction;
