import { getAccountList } from "@/lib/account/account.service";
import { PageHeader } from "../_shared/header";
import { getBalancesList } from "@/lib/balance/balance.service";
import type Account from "@/lib/account/account.type";
import { currencyFormat } from "@/lib/shared/helpers";
import Image from "next/image";

export default async function AccountsPage() {
  const accountsBalancesData = await getAccountPageData();

  return (
    <div>
      {/* TODO: Page Header should be configurable in the Layout */}
      <PageHeader title="Accounts" />
      <ul className="divide-y divide-gray-100">
        {accountsBalancesData.map((data) => (
          <li
            key={data.account?.id}
            className="flex justify-between gap-x-6 py-5"
          >
            <div className="flex min-w-0 gap-x-4">
              <Image
                src={data.account?.institutionLogoUrl}
                className="size-12 flex-none rounded-full bg-gray-50"
                width={48}
                height={48}
                alt="Logo"
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  {data.account?.name}
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {data.account.institutionName}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
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
