import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type Institution from "../_lib/institution.type";
import Image from "next/image";
import Link from "next/link";
import { createDataAccess } from "../_lib/actions";

export default function InstitutionList({
  institutionsList,
}: {
  institutionsList: Institution[];
}) {
  return (
    <ul className="divide-y divide-gray-100">
      {institutionsList.map((institution) => (
        <li
          key={institution.id}
          className="relative flex justify-between gap-x-6 py-5"
        >
          <div className="flex min-w-0 gap-x-4">
            <Image
              src={institution.logo}
              className="size-12 flex-none rounded-full bg-gray-50"
              width={48}
              height={48}
              alt="Logo"
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900 ">
                <button
                  type="submit"
                  onClick={createDataAccess}
                  className="hover:cursor-pointer"
                >
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {institution.name}
                </button>
              </p>
              <p className="mt-1 flex text-xs/5 text-gray-500 relative truncate ">
                {institution.bic}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
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
