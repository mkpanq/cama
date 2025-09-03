export type Requisition = {
  id: string;
  link: string;
};

export type RequisitionApiResponse = {
  id: string;
  created: string;
  redirect: string;
  status: string;
  institution_id: string;
  agreement: string;
  reference: string;
  accounts: string[];
  user_language: string;
  link: string;
  ssn: string;
  account_selection: boolean;
  redirect_immediate: boolean;
};
