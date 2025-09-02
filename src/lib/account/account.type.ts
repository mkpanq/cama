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

// Account{
// description:
// AccountSerializer.

// id	string($uuid)
// readOnly: true
// The ID of this Account, used to refer to this account in other API calls.

// created	string($date-time)
// readOnly: true
// The date & time at which the account object was created.

// last_accessed	string($date-time)
// readOnly: true
// The date & time at which the account object was last accessed.

// iban	string
// readOnly: true
// The Account IBAN

// bban	string
// readOnly: true
// The Account BBAN

// status	string
// readOnly: true
// The processing status of this account.

// institution_id	string
// readOnly: true
// The ASPSP associated with this account.

// owner_name	string
// readOnly: true
// The name of the account owner.

// name	string
// readOnly: true
// The name of account.

// }
