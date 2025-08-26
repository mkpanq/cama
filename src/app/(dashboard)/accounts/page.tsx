import { getAccountList } from "@/lib/account/account.service";
import { PageHeader } from "../_shared/header";
import { getBalancesList } from "@/lib/balance/balance.service";
import type Account from "@/lib/account/account.type";
import { currencyFormat } from "@/lib/shared/helpers";
import Image from "next/image";

// TODO: Better handle static/dyamic rendering - look at the docs and see if we can use some partial rerendering
export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accountsBalancesData = await getAccountPageData();

  return (
    <div>
      <PageHeader title="Accounts" />
      <ul className="divide-y divide-gray-100">
        {accountsBalancesData.map((data) => (
          <li
            key={data.account?.id}
            className="flex justify-between gap-x-6 py-5"
          >
            <div className="flex min-w-0 gap-x-4">
              {data.account?.institutionLogoUrl ? (
                <Image
                  src={data.account?.institutionLogoUrl}
                  className="size-12 flex-none rounded-full bg-gray-50"
                  width={48}
                  height={48}
                  alt="Logo"
                />
              ) : (
                // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
                    clipRule="evenodd"
                  />
                  <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                </svg>
              )}
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {data.account?.name ?? data.account?.ownerName}
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {data.account.institutionName}
                </p>
              </div>
            </div>
            <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-xl font-bold text-gray-900">
                {currencyFormat(data.balance, data.currency)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const getAccountPageData = async (): Promise<
  {
    account: Account;
    currency: string;
    balance: number;
  }[]
> => {
  const accounts = await getAccountList();
  const balances = await getBalancesList();

  const pageData: {
    account: Account;
    currency: string;
    balance: number;
  }[] = [];

  accounts.forEach((account) => {
    const balanceData = balances.filter(
      (balance) => balance.accountId === account.id,
    );
    const currencyMap: { [currency: string]: number } = {};

    balanceData.forEach((balance) => {
      if (currencyMap[balance.currency]) {
        currencyMap[balance.currency] += balance.amount;
      } else {
        currencyMap[balance.currency] = balance.amount;
      }
    });

    Object.entries(currencyMap).forEach(([currency, balance]) => {
      pageData.push({
        account,
        currency,
        balance,
      });
    });
  });

  return pageData;
};
