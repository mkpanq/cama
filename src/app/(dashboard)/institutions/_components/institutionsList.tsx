import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { createBankConnection } from "../_lib/actions";
import Form from "next/form";
import type { InstitutionApiResponse } from "@/lib/institution/institution.type";

export default function InstitutionList({
  institutionsList,
}: {
  institutionsList: InstitutionApiResponse[];
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

function InstitutionListElement({
  institution,
}: {
  institution: InstitutionApiResponse;
}) {
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
              {institution.transaction_total_days} days
            </span>
          </p>
          <div className="mt-1 flex items-center gap-x-1.5">
            <p className="text-xs/5 text-gray-500">
              Max access:{" "}
              <span className="font-black">
                {institution.max_access_valid_for_days} days
              </span>
            </p>
          </div>
        </div>
        <Form action={createBankConnection}>
          <input type="hidden" name="institutionId" value={institution.id} />
          <input
            type="hidden"
            name="maxTransactionTotalDays"
            value={institution.transaction_total_days}
          />
          <input
            type="hidden"
            name="maxDaysAccess"
            value={institution.max_access_valid_for_days}
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
        </Form>
      </div>
    </li>
  );
}
