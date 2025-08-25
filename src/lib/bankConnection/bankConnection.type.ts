type BankConnection = {
  id: string;
  referenceId: string;
  institutionId: string;
  agreementId: string;
  requisitionId: string;
  maxHistoricalDays: number;
  validFor: number;
  agreementCreationDate: Date;
  agreementExpirationDate: Date;
  requisitionCreationDate: Date;
};

export default BankConnection;
