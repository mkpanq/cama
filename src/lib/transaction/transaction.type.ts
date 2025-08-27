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
};

export type DisplayedTransaction = Transaction & {
  accountName: string | undefined | null;
  institutionName: string | undefined;
};
