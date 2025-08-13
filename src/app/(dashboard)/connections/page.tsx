import { getAllConnections } from "@/lib/bankConnection/bankConnection.service";
import { PageHeader } from "../_shared/header";
import ConnectionsList from "./_components/connectionsList";

export default async function MainInstitutionsPage() {
  const data = await getAllConnections();

  return (
    <>
      <PageHeader title="Current connections" />
      <ConnectionsList connectionsList={data} />
    </>
  );
}
