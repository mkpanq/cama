type Account = {
  id: string;
  // API-aligned fields
  created: Date;
  lastAccessed: Date;
  iban: string;
  bban: string | null;
  status: string | null;
  institutionId: string;
  ownerName: string | null;
  name: string | null;
  // existing extra fields kept
  bankConnectionId: string;
  institutionName: string;
  institutionLogoUrl: string | null;
  currency?: string | null;
  lastSync: Date | null;
};

export default Account;
