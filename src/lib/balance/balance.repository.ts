import getDBClient from "@/db/client";
import { balancesTable } from "@/db/schema/balance";
import { eq, sql } from "drizzle-orm";
import type AccountBalance from "./balance.type";

export const saveBalanceDataToDB = async (balances: AccountBalance[]) => {
  const db = getDBClient();

  const data = await db
    .insert(balancesTable)
    .values(balances)
    .onConflictDoUpdate({
      target: [balancesTable.accountId, balancesTable.type],
      set: {
        amount: sql`excluded.amount`,
        referenceDate: sql`excluded.reference_date`,
        creditLimitIncluded: sql`excluded.credit_limit_included`,
        lastChangeDateTime: sql`excluded.last_change_datetime`,
        lastCommittedTransaction: sql`excluded.last_committed_transaction`,
      },
    })
    .returning({ id: balancesTable.id });

  return data.map((balance) => balance.id);
};

export const getBalanceForCurrentUser = async (): Promise<AccountBalance[]> => {
  const db = getDBClient();

  return db.select().from(balancesTable).where(
    // TODO: Watch out for balance types
    eq(balancesTable.type, "interimAvailable"),
  );
};
