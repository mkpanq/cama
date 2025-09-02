import "server-only";

import getDBClient from "@/db/client";
import { accountsTable } from "@/db/schema/account";
import { eq } from "drizzle-orm";
import type { Account } from "./account.type";

export const bulkSave = async (accounts: Account[]): Promise<string[]> => {
  const db = getDBClient();

  const data = await db
    .insert(accountsTable)
    .values(accounts)
    .returning({ id: accountsTable.id });

  return data.map((acc) => acc.id);
};

export const updateLastSyncDate = async (accountId: string) => {
  const db = getDBClient();
  const id = await db
    .update(accountsTable)
    .set({ lastSync: new Date() })
    .where(eq(accountsTable.id, accountId))
    .returning({
      id: accountsTable.id,
    });

  return id;
};

export const getAll = async (): Promise<Account[]> => {
  const db = getDBClient();
  const data = await db.select().from(accountsTable);

  return data as Account[];
};
