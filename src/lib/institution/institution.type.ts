type Institution = {
  id: string;
  name: string;
  bic: string;
  maxTransactionTotalDays: number;
  logo: string;
  supportedFeatures: string[];
  maxDaysAccess: number;
};

export default Institution;
