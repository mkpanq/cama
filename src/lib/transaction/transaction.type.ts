export type Transaction = {
  id: string;
  accountId: string;
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

export type DisplayedTransaction = Transaction & {
  accountName: string | undefined | null;
  institutionName: string | undefined;
};
