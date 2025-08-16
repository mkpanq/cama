import getDBClient from "@/db/client";
import { balancesTable } from "@/db/schema/balance";
import { and, eq, sql } from "drizzle-orm";
import { getCurrentUser } from "../shared/supabaseServerClient";
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
      },
    })
    .returning({ id: balancesTable.id });

  return data.map((balance) => balance.id);
};

export const getBalanceForCurrentUser = async (): Promise<AccountBalance[]> => {
  const db = getDBClient();
  const { id } = await getCurrentUser();

  return db
    .select()
    .from(balancesTable)
    .where(
      // For now get only "expected" type of balances
      and(eq(balancesTable.userId, id), eq(balancesTable.type, "expected")),
    );
};
