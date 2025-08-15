import { removeBankConnection } from "../_lib/actions";
import type BankConnection from "@/lib/bankConnection/bankConnection.type";

export default function ConnectionsList({
  connectionsList,
}: {
  connectionsList: BankConnection[];
}) {
  return (
    <ul className="divide-y divide-gray-100 space-y-2">
      {connectionsList.map((connection) => (
        <ConnectionListElement key={connection.id} connection={connection} />
      ))}
    </ul>
  );
}

function ConnectionListElement({ connection }: { connection: BankConnection }) {
  return (
    <li className="relative flex justify-between py-5 border-b border-gray-200 px-3">
      <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
        <div className="min-w-0 flex-auto">
          <p className="text-sm/6 font-semibold text-gray-900">
            {connection.institutionId}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
        <div className="hidden sm:block">
          <p className="text-sm/6 text-gray-900">
            Valid For:{" "}
            <span className="font-black">
              {calculateValidForDays(connection)} days
            </span>
          </p>
          <div className="mt-1 flex items-center gap-x-1.5">
            <p className="text-xs/5 text-gray-500">
              Expires:{" "}
              <span className="font-black">
                {connection.agreementExpirationDate.toDateString()}
              </span>
            </p>
          </div>
        </div>
        <form action={removeBankConnection}>
          <input type="hidden" name="bankConnectionId" value={connection.id} />
          <button type="submit" className="hover:cursor-pointer">
            <p className="text-xs/5 text-gray-500 hover:text-red-400 hover:cursor-pointer">
              Click to remove connection
            </p>
          </button>
        </form>
      </div>
    </li>
  );
}

function calculateValidForDays(connection: BankConnection): number {
  const currentDate = new Date();
  const agreementExpirationDate = new Date(connection.agreementExpirationDate);
  const differenceInMilliseconds =
    agreementExpirationDate.getTime() - currentDate.getTime();
  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );
  return differenceInDays;
}
