import { currencyFormat } from "@/lib/shared/helpers";
import type Transaction from "@/lib/transaction/transaction.type";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

const transactions: Transaction[] = [
  {
    id: "1",
    accountId: "A12345",
    userId: "U98765",
    bookingDate: new Date("2023-04-01"),
    type: "OUTGOING",
    amount: 100.5,
    currency: "EUR",
    counterpartyDetails: {
      name: "John Doe",
      iban: "DE89370400440532013000",
    },
    transactionCode: "TX12345",
    description: "Payment to supplier",
  },
  {
    id: "2",
    accountId: "A67890",
    userId: "U54321",
    bookingDate: new Date("2023-04-02"),
    type: "INCOMING",
    amount: 50.75,
    currency: "USD",
    counterpartyDetails: {
      name: "Jane Smith",
      iban: "FR1420041010050500013M02",
    },
    transactionCode: "TX67890",
    description: "Interest earned",
  },
  {
    id: "3",
    accountId: "A24680",
    userId: "U13579",
    bookingDate: new Date("2023-04-03"),
    type: "OUTGOING",
    amount: 25.0,
    currency: "GBP",
    counterpartyDetails: {
      name: "Alice Johnson",
      iban: "GB33BUKB20201555555555",
    },
    transactionCode: "TX24680",
    description: "Online purchase",
  },
  {
    id: "4",
    accountId: "A13579",
    userId: "U24680",
    bookingDate: new Date("2023-04-04"),
    type: "INCOMING",
    amount: 75.2,
    currency: "EUR",
    counterpartyDetails: {
      name: "Bob Brown",
      iban: "DE89370400440532013000",
    },
    transactionCode: "TX13579",
    description: "Refund from merchant",
  },
  {
    id: "5",
    accountId: "A24681",
    userId: "U13578",
    bookingDate: new Date("2023-04-05"),
    type: "OUTGOING",
    amount: 15.9,
    currency: "USD",
    counterpartyDetails: {
      name: "Charlie Davis",
      iban: "FR1420041010050500013M02",
    },
    transactionCode: "TX24681",
    description: "ATM withdrawal",
  },
];

export default function TransactionsTable() {
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
