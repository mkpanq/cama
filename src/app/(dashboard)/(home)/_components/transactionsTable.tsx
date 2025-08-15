"use client";

import { currencyFormat } from "@/lib/shared/helpers";
import type Transaction from "@/lib/transaction/transaction.type";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import getDBClient from "@/db/client";
import { transactionsTable } from "@/db/schema/transaction";
// import { getCurrentUser } from "@/lib/shared/supabaseServerClient";
import { eq } from "drizzle-orm";

// TODO: Fix displaying of transactions - pagination, account name, etc.
export default function TransactionsTable() {
  const transactions: Transaction[] = [];
  // const transactions: Transaction[] = await getAllTransactions();

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="relative min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-3 pl-4 text-right text-sm font-semibold whitespace-nowrap text-gray-900 sm:pl-0"
                />
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                >
                  Account
                </th>
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                >
                  TransactionCode
                </th>
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                >
                  Booking Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="flex gap-4 items-center justify-end py-2 pr-3 pl-4 text-right font-bold text-sm text-gray-500 sm:pl-0">
                    {currencyFormat(transaction.amount, transaction.currency)}
                    {transaction.type === "OUTGOING" ? (
                      <ArrowUpIcon className="size-3.5 text-red-500" />
                    ) : (
                      <ArrowDownIcon className="size-3.5 text-green-500" />
                    )}
                  </td>
                  <td className="px-2 py-2 text-sm font-medium truncate text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-900">
                    {transaction.accountId}
                  </td>
                  <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-500">
                    {transaction.transactionCode}
                  </td>
                  <td className="px-2 py-2 text-sm whitespace-nowrap text-gray-500">
                    {transaction.bookingDate.toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// const getAllTransactions = async (): Promise<Transaction[]> => {
//   const db = await getDBClient();
//   // const { id } = await getCurrentUser("BROWSER");

//   // Fetch transactions from the database
//   const dbTransactions = await db
//     .select()
//     .from(transactionsTable)
//     .where(eq(transactionsTable.userId, id));

//   // Convert each dbTransaction to a Transaction type
//   const transactions: Transaction[] = dbTransactions.map((dbTransaction) => {
//     return {
//       id: dbTransaction.id,
//       accountId: dbTransaction.accountId,
//       userId: dbTransaction.userId,
//       bookingDate: new Date(dbTransaction.bookingDate),
//       type: dbTransaction.type,
//       amount: dbTransaction.amount,
//       currency: dbTransaction.currency,
//       counterpartyDetails: {
//         name: dbTransaction.counterpartyName,
//         iban: dbTransaction.counterpartyIban,
//       },
//       transactionCode: dbTransaction.transactionCode,
//       description: dbTransaction.description,
//     };
//   });

//   return transactions;
// };
