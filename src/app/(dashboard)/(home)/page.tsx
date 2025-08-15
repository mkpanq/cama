import { PageHeader } from "../_shared/header";
import Stats from "./_components/stats";
import TransactionsTable from "./_components/transactionsTable";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <Stats />
      <TransactionsTable />
    </>
  );
}
