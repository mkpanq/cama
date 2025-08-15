import { returnBalanceStatsData } from "@/lib/balance/balance.service";
import { currencyFormat } from "@/lib/shared/helpers";

export default async function Stats() {
  const { totalBalancesByCurrency } = await returnBalanceStatsData();

  return (
    <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        key="total"
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
      >
        <dt className="text-sm/6 font-medium text-gray-500">Total</dt>
        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
          {Object.entries(totalBalancesByCurrency).map(([currency, amount]) => (
            <div key={currency}>{currencyFormat(amount, currency)}</div>
          ))}
        </dd>
      </div>
      {/* <div
        key="total_incomes"
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
      >
        <dt className="text-sm/6 font-medium text-gray-500">
          Total income in last 30 days
        </dt>
        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
          $10,123.00
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
          $12,223.00
        </dd>
      </div>
      <div
        key="total_differenve"
        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
      >
        <dt className="text-sm/6 font-medium text-gray-500">Difference</dt>
        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
          - $123.00
        </dd>
      </div> */}
    </dl>
  );
}
