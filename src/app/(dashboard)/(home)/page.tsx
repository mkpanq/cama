import { getAllTransactions } from "@/lib/transaction/transaction.service";
import { PageHeader } from "../_shared/header";
import Stats from "./_components/stats";
import TransactionsTable from "./_components/transactionsTable";
import type { DisplayedTransaction } from "@/lib/transaction/transaction.type";
import { syncBankData } from "./_lib/actions";
import Form from "next/form";

// TODO: Add last update date / set cron for automatic update every day
export default async function DashboardPage() {
  const transactions: DisplayedTransaction[] = await getAllTransactions();

  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader title="Dashboard" />
        <Form action={syncBankData}>
          <button
            className="hover:cursor-pointer rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
            type="submit"
          >
            Update data
          </button>
        </Form>
      </div>
      <Stats transactions={transactions} />
      <TransactionsTable transactions={transactions} />
    </>
  );
}
