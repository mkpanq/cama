import "server-only";
import getDBClient from "@/db/client";
import { bankConnectionTable } from "@/db/schema/bankConnection";
import type { EndUserAgreement } from "./agreement/agreement.type";
import { and, eq, isNotNull } from "drizzle-orm";

export const createBankConnection = async (
  bankConnectionAgreement: EndUserAgreement,
  institutionName?: string,
  institutionLogo?: string,
) => {
  const db = getDBClient();
  const data = await db
    .insert(bankConnectionTable)
    .values({
      id: crypto.randomUUID(),
      referenceId: crypto.randomUUID(),
      agreementId: bankConnectionAgreement.id,
      institutionId: bankConnectionAgreement.institutionId,
      institutionName: institutionName,
      institutionLogo: institutionLogo,
      maxHistoricalDays: bankConnectionAgreement.maxHistoricalDays,
      agreementCreationDate: bankConnectionAgreement.createdDate,
      agreementExpirationDate: bankConnectionAgreement.expirationDate,
    })
    .returning();

  return data[0];
};

export const updateRequisitionId = async (
  referenceId: string,
  requisitionId: string,
): Promise<string | null> => {
  const db = getDBClient();
  const data = await db
    .update(bankConnectionTable)
    .set({ requisitionId: requisitionId })
    .where(eq(bankConnectionTable.referenceId, referenceId))
    .returning({ id: bankConnectionTable.requisitionId });

  return data[0].id;
};

export const getViaReferenceId = async (referenceId: string) => {
  const db = getDBClient();
  const bankConnection = await db
    .select()
    .from(bankConnectionTable)
    .where(eq(bankConnectionTable.referenceId, referenceId));

  return bankConnection[0];
};

export const updateRequisitionCreationDate = async (
  bankConnectionId: string,
  requisitionCreationDate: Date,
): Promise<string> => {
  const db = getDBClient();
  const connection = await db
    .update(bankConnectionTable)
    .set({ requisitionCreationDate: requisitionCreationDate })
    .where(eq(bankConnectionTable.id, bankConnectionId))
    .returning({ id: bankConnectionTable.id });

  return connection[0].id;
};

export const getViaConnectionId = async (id: string) => {
  const db = getDBClient();
  return await db
    .select()
    .from(bankConnectionTable)
    .where(eq(bankConnectionTable.id, id));
};

export const deleteConnection = async (id: string) => {
  const db = getDBClient();
  const deletedId = await db
    .delete(bankConnectionTable)
    .where(eq(bankConnectionTable.id, id))
    .returning({ id: bankConnectionTable.id });

  return deletedId[0]?.id;
};

export const getAll = async () => {
  const db = getDBClient();
  return await db
    .select()
    .from(bankConnectionTable)
    .where(
      and(
        isNotNull(bankConnectionTable.requisitionId),
        isNotNull(bankConnectionTable.requisitionCreationDate),
      ),
    );
};
