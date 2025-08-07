import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type Institution from "../../../../lib/institution/institution.type";
import Image from "next/image";
import { createBankConnection } from "../_lib/actions";

// TODO:
// Need to differ already saved institution list from ones, that are already saved
// We could add removal/sync options to those that are saved

export default function InstitutionList({
  institutionsList,
}: {
  institutionsList: Institution[];
}) {
  return (
    <ul className="divide-y divide-gray-100">
      {institutionsList.map((institution) => (
        <li key={institution.id} className="relative flex justify-between py-5">
          <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
            <Image
              src={institution.logo}
              className="size-12 flex-none rounded-full bg-gray-50"
              width={48}
              height={48}
              alt="Logo"
            />
            <div className="min-w-0 flex-auto">
              <form action={createBankConnection}>
                <p className="text-sm/6 font-semibold text-gray-900">
                  <input
                    type="hidden"
                    name="institutionId"
                    value={institution.id}
                  />
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
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {institution.name}
                  </button>
                </p>
              </form>
              <p className="mt-1 flex text-xs/5 text-gray-500">
                {institution.id}
              </p>
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
            <ChevronRightIcon
              aria-hidden="true"
              className="size-5 flex-none text-gray-400"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
