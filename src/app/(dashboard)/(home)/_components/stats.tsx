import { returnBalanceTotals } from "@/lib/balance/balance.service";
import { currencyFormat } from "@/lib/shared/helpers";
import type { DisplayedTransaction } from "@/lib/transaction/transaction.type";

export default async function Stats({
  transactions,
}: {
  transactions: DisplayedTransaction[];
}) {
  const { currency, total } = await returnBalanceTotals();
  const { income, expenses, difference } =
    calculateTransactionsStats(transactions);

  return (
    <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        key="total"
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
      >
        <dt className="text-sm/6 font-medium text-gray-500">Total</dt>
        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
          {currencyFormat(total, currency)}
        </dd>
      </div>
      <div
        key="total_incomes"
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
      >
        <dt className="text-sm/6 font-medium text-gray-500">
          Total income in last 30 days
        </dt>
        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
          {currencyFormat(income, currency)}
        </dd>
      </div>
      <div
        key="total_expenses"
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
      >
        <dt className="text-sm/6 font-medium text-gray-500">
          Total expenses in last 30 days
        </dt>
        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
          {currencyFormat(expenses, currency)}
        </dd>
      </div>
      <div
        key="total_differenve"
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
      >
        <dt className="text-sm/6 font-medium text-gray-500">Difference</dt>
        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
          {currencyFormat(difference, currency)}
        </dd>
      </div>
    </dl>
  );
}

const calculateTransactionsStats = (
  transactions: DisplayedTransaction[],
): {
  income: number;
  expenses: number;
  difference: number;
} => {
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "INCOMING") {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  const totalDifference = totalIncome - totalExpenses;

  return {
    income: totalIncome,
    expenses: totalExpenses,
    difference: totalDifference,
  };
};
