import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type Institution from "../../../../lib/institution/institution.type";
import Image from "next/image";
import { createBankConnection, removeBankConnection } from "../_lib/actions";

export default function InstitutionList({
  institutionsList,
}: {
  institutionsList: Institution[];
}) {
  return (
    <ul className="divide-y divide-gray-100 space-y-2">
      {institutionsList.map((institution) => (
        <InstitutionListElement
          key={institution.id}
          institution={institution}
        />
      ))}
    </ul>
  );
}

function InstitutionListElement({ institution }: { institution: Institution }) {
  return (
    <li className="relative flex justify-between py-5 border-b border-gray-200 px-3">
      <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
        <Image
          src={institution.logo}
          className="size-12 flex-none rounded-full bg-gray-50"
          width={48}
          height={48}
          alt="Logo"
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm/6 font-semibold text-gray-900">
            {institution.name}
          </p>
          <p className="mt-1 flex text-xs/5 text-gray-500">{institution.id}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
        <div className="hidden sm:block">
          <p className="text-sm/6 text-gray-900">
            Transaction total days:{" "}
            <span className="font-black">
              {institution.maxTransactionTotalDays} days
            </span>
          </p>
          <div className="mt-1 flex items-center gap-x-1.5">
            <p className="text-xs/5 text-gray-500">
              Max access:{" "}
              <span className="font-black">
                {institution.maxDaysAccess} days
              </span>
            </p>
          </div>
        </div>
        {institution.bankConnectionId ? (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-x-1.5">
              <div className="size-2 rounded-full bg-emerald-500" />
              <p className="text-xs/5 text-gray-500">Connected</p>
            </div>
            <form action={removeBankConnection}>
              <input
                type="hidden"
                name="institutionId"
                value={institution.id}
              />
              <input
                type="hidden"
                name="bankConnectionId"
                value={institution.bankConnectionId}
              />
              <button type="submit" className="hover:cursor-pointer">
                <p className="text-xs/5 text-gray-500 hover:text-red-400 hover:cursor-pointer">
                  Click to remove connection
                </p>
              </button>
            </form>
          </div>
        ) : (
          <form action={createBankConnection}>
            <input type="hidden" name="institutionId" value={institution.id} />
            <input
              type="hidden"
              name="maxTransactionTotalDays"
              value={institution.maxTransactionTotalDays}
            />
            <input
              type="hidden"
              name="maxDaysAccess"
              value={institution.maxDaysAccess}
            />
            <button type="submit" className="hover:cursor-pointer">
              <div className="flex items-center px-3 py-1 rounded-2xl border border-gray-300">
                <p className="text-xs/5 text-gray-500 ">Click to connect</p>
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-5 flex-none text-gray-400"
                />
              </div>
            </button>
          </form>
        )}
      </div>
    </li>
  );
}
