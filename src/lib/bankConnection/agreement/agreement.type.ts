export type EndUserAgreement = {
  id: string;
  institutionId: string;
  maxHistoricalDays: number | null; //I accept null there only bc api could return null - but days should always be available via institution endpoint
  createdDate: Date;
  expirationDate: Date;
};

export type EndUserAgreementApiResponse = {
  id: string;
  institution_id: string;
  max_historical_days: number | null;
  access_valid_for_days: number | null;
  access_scope: string[] | null;
};
