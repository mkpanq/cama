import InstitutionList from "@/app/(dashboard)/institutions/_components/institutionsList";
import type { EndUserAgreement } from "./agreement/agreement.type";

type BankConnection = {
  id: string;
  referenceId: string;
  requisitionId: string | null;

  institutionLogo: string | null;
  institutionName: string | null;
  agreement: EndUserAgreement;
};

export default BankConnection;
