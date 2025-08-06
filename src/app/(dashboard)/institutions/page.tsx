import { getInstitutionList } from "@/lib/institution/institution.service";
import InstitutionList from "./_components/institutionsList";

export default async function MainInstitutionsPage() {
  const data = await getInstitutionList();

  return InstitutionList({
    institutionsList: data,
  });
}
