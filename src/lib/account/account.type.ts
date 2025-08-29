type Account = {
  id: string;
  bankConnectionId: string;
  institutionId: string;
  institutionName: string;
  institutionLogoUrl: string | null;
  iban: string;
  bban: string | null;
  status: string | null;
  ownerName: string | null;
  name: string | null;
  createdAt: Date | null;
  lastAccessed: Date | null;
  lastSync: Date | null;
};

export default Account;
