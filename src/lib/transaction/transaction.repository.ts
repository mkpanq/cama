import getDbClient from "@/db/client";
import { accountsTable } from "@/db/schema/account";
import { transactionsTable } from "@/db/schema/transaction";
import { gte, desc, eq } from "drizzle-orm";
import type { Transaction } from "./transaction.type";

export const saveAll = async (transactions: Transaction[]) => {
  const db = getDbClient();

  const data = await db
    .insert(transactionsTable)
    .values(transactions)
    .onConflictDoNothing({
      target: transactionsTable.id,
    })
    .returning({ id: transactionsTable.id });

  return data.map((transaction) => transaction.id);
};

export const getAll = async () => {
  const db = getDbClient();

  const dbTransactions = await db
    .select()
    .from(transactionsTable)
    .where(
      gte(
        transactionsTable.bookingDate,
        new Date(new Date().setDate(new Date().getDate() - 30)),
      ),
    )
    .orderBy(desc(transactionsTable.bookingDate))
    .leftJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id));

  return dbTransactions;
};
