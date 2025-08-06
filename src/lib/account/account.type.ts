type Account = {
  id: string;
  userId: string;
  requisitionId: string;
  institutionId: string;
  institutionResourceId: string;
  iban: string;
  currency: string;
  bban: string | null;
  status: string | null;
  ownerName: string | null;
  name: string | null;
  product: string | null;
  cashAccountType: string | null;
};

export default Account;
