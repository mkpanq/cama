import { getInstitutionList } from "@/app/(dashboard)/institutions/_lib/institution";
import InstitutionList from "./_components/institutionsList";

export default async function MainInstitutionsPage() {
  const data = await getInstitutionList();

  return InstitutionList({
    institutionsList: data,
  });
}
