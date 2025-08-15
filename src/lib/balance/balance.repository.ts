import getDBClient from "@/db/client";
import { balancesTable } from "@/db/schema/balance";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "../shared/supabaseServerClient";
import type AccountBalance from "./balance.type";

export const saveBalanceDataToDB = async (balances: AccountBalance[]) => {
  const db = await getDBClient();

  const data = await db
    .insert(balancesTable)
    .values(balances)
    .returning({ id: balancesTable.id });

  return data.map((balance) => balance.id);
};

export const getBalanceForCurrentUser = async (): Promise<AccountBalance[]> => {
  const db = await getDBClient();
  const { id } = await getCurrentUser();

  return db
    .select()
    .from(balancesTable)
    .where(
      // For now get only "expected" type of balances
      and(eq(balancesTable.userId, id), eq(balancesTable.type, "expected")),
    );
};
