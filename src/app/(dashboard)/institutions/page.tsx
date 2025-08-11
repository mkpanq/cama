import { getInstitutionList } from "@/lib/institution/institution.service";
import InstitutionList from "./_components/institutionsList";
import { PageHeader } from "../_shared/header";

export default async function MainInstitutionsPage() {
  const data = await getInstitutionList();

  return (
    <>
      <PageHeader title="Institutions" />
      <InstitutionList institutionsList={data} />
    </>
  );
}
