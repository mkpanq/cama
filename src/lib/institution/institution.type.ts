type Institution = {
  id: string;
  name: string;
  bic: string;
  maxTransactionTotalDays: number;
  logo: string;
  bankConnectionId: string | null;
  supportedFeatures: string[];
  maxDaysAccess: number;
};

export default Institution;
