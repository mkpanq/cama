type Institution = {
  id: string;
  name: string;
  bic: string;
  maxTransactionTotalDays: number;
  logo: string;
  status: "CONNECTED" | "NOT_CONNECTED";
  supportedFeatures: string[];
  maxDaysAccess: number;
};

export default Institution;
