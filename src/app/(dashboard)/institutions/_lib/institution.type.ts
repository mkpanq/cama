type Institution = {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
  supported_features: string[];
  identification_codes: string[];
  max_access_valid_for_days: string;
};

export default Institution;
