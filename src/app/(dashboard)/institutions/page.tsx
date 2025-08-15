import {
  getInstitutionDetails,
  getInstitutionList,
} from "@/lib/institution/institution.service";
import InstitutionList from "./_components/institutionsList";
import { PageHeader } from "../_shared/header";
import ConnectionsList from "./_components/connectionsList";
import { getAllConnections } from "@/lib/bankConnection/bankConnection.service";
import type BankConnection from "@/lib/bankConnection/bankConnection.type";

export default async function MainInstitutionsPage() {
  const institutions = await getInstitutionList();
  const connections = await getConnectionsData();

  return (
    <>
      <PageHeader title="Connections" />
      <ConnectionsList connectionsList={connections} />
      <PageHeader title="Institutions" />
      <InstitutionList institutionsList={institutions} />
    </>
  );
}

const getConnectionsData = async (): Promise<
  (BankConnection & {
    institutionName: string;
    institutionLogo: string;
  })[]
> => {
  const bankConnections: (BankConnection & {
    institutionName: string;
    institutionLogo: string;
  })[] = [];

  const connections = await getAllConnections();
  connections.forEach(async (connection) => {
    const relatedInstitutionData = await getInstitutionDetails(
      connection.institutionId,
    );

    const updatedConnection = {
      ...connection,
      institutionName: relatedInstitutionData.name,
      institutionLogo: relatedInstitutionData.logo,
    };

    bankConnections.push(updatedConnection);
  });

  return bankConnections;
};
