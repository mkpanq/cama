import { getAllTransactions } from "@/lib/transaction/transaction.service";
import { PageHeader } from "../_shared/header";
import Stats from "./_components/stats";
import TransactionsTable from "./_components/transactionsTable";
import type { DisplayedTransaction } from "@/lib/transaction/transaction.type";

export default async function DashboardPage() {
  const transactions: DisplayedTransaction[] = await getAllTransactions();

  return (
    <>
      <PageHeader title="Dashboard" />
      <Stats />
      <TransactionsTable transactions={transactions} />
    </>
  );
}
