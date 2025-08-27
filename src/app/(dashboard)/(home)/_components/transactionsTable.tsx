"use client";

import { currencyFormat } from "@/lib/shared/helpers";
import type { DisplayedTransaction } from "@/lib/transaction/transaction.type";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function TransactionsTable({
  transactions,
}: {
  transactions: DisplayedTransaction[];
}) {
  const transactionsPerPage = 20;
  const maxPage = Math.ceil(transactions.length / transactionsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedTransactions, setDisplayedTransactions] = useState<
    DisplayedTransaction[]
  >([]);

  const nextPage = (currentPage: number) => {
    if (currentPage < maxPage) setCurrentPage(currentPage + 1);
  };

  const previousPage = (currentPage: number) => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    const getTransactionSlice = (page: number) => {
      return transactions.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage,
      );
    };

    setDisplayedTransactions(getTransactionSlice(currentPage));
  }, [currentPage, transactions]);

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
                  className="max-sm:hidden px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                >
                  Account
                </th>
                <th
                  scope="col"
                  className="max-sm:hidden px-2 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900"
                >
                  Booking Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {displayedTransactions.map((transaction) => (
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
                  <td className="max-sm:hidden px-2 py-2 text-sm whitespace-nowrap text-gray-900">
                    {transaction.institutionName}
                  </td>
                  <td className="max-sm:hidden px-2 py-2 text-sm whitespace-nowrap text-gray-500">
                    {transaction.bookingDate.toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <nav
        aria-label="Pagination"
        className="flex items-center justify-between border-t border-gray-200  px-4 py-3 sm:px-6"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{maxPage}</span>
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => previousPage(currentPage)}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 inset-ring inset-ring-gray-300 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => nextPage(currentPage)}
            className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 inset-ring inset-ring-gray-300 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
}
