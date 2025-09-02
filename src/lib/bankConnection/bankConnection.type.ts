import type { EndUserAgreement } from "./agreement/agreement.type";

type BankConnection = {
  id: string;
  referenceId: string;
  requisitionId: string | null;

  agreement: EndUserAgreement;
};

export default BankConnection;
