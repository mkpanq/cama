type Account = {
  id: string;
  userId: string;
  bankConnectionId: string;
  institutionId: string;
  institutionName: string;
  institutionLogoUrl: string | null;
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
