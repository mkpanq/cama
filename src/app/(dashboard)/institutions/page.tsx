import { getInstitutionList } from "@/app/(dashboard)/institutions/_lib/institutionsList";
import InstitutionList from "./_components/institutionsList";

export default async function MainInstitutionsPage() {
  const data = await getInstitutionList();

  return InstitutionList({
    institutionsList: data,
  });
}
