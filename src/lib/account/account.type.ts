export type Account = {
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

export type AccountApiResponse = {
  id: string;
  institution_id: string;
  iban: string;

  last_accessed: string | null;
  created: string | null;
  status: string | null;
  owner_name: string | null;
  bban: string | null;
  name: string | null;
};
