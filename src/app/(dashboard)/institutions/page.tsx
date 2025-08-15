import { getInstitutionList } from "@/lib/institution/institution.service";
import InstitutionList from "./_components/institutionsList";
import { PageHeader } from "../_shared/header";
import ConnectionsList from "./_components/connectionsList";
import { getAllConnections } from "@/lib/bankConnection/bankConnection.service";

export default async function MainInstitutionsPage() {
  const institutions = await getInstitutionList();
  const connections = await getAllConnections();

  return (
    <>
      <PageHeader title="Connections" />
      <ConnectionsList connectionsList={connections} />
      <PageHeader title="Institutions" />
      <InstitutionList institutionsList={institutions} />
    </>
  );
}
