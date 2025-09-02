import "server-only";
import getDBClient from "@/db/client";
import { bankConnectionTable } from "@/db/schema/bankConnection";
import type { EndUserAgreement } from "./agreement/agreement.type";
import { eq } from "drizzle-orm";

export const createBankConnection = async (
  bankConnectionAgreement: EndUserAgreement,
) => {
  const db = getDBClient();
  const data = await db
    .insert(bankConnectionTable)
    .values({
      id: crypto.randomUUID(),
      referenceId: crypto.randomUUID(),
      agreementId: bankConnectionAgreement.id,
      institutionId: bankConnectionAgreement.institutionId,
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

// const getAllConnections = async (): Promise<BankConnection[]> => {
//   const db = getDBClient();
//   const connections = await db
//     .select()
//     .from(bankConnectionTable)
//     .where(
//       and(
//         isNotNull(bankConnectionTable.requisitionId),
//         isNotNull(bankConnectionTable.requisitionCreationDate),
//       ),
//     );

//   return connections as BankConnection[];
// };

// const deleteBankConnection = async (
//   bankConnectionId: string,
// ): Promise<string | undefined> => {
//   const db = getDBClient();
//   const data = await db
//     .select({ id: bankConnectionTable.requisitionId })
//     .from(bankConnectionTable)
//     .where(and(eq(bankConnectionTable.id, bankConnectionId)));

//   const requisitionId = data[0]?.id;
//   if (!requisitionId) {
//     console.error("No requisition found for the given bank connection ID");
//     return;
//   }

//   const result = await deleteRequisitionFromApi(requisitionId);

//   if (!result) {
//     console.error("Failed to delete requisition from API");
//     return;
//   }

//   const deletedId = await db
//     .delete(bankConnectionTable)
//     .where(eq(bankConnectionTable.id, bankConnectionId))
//     .returning({ id: bankConnectionTable.id });

//   return deletedId[0]?.id;
// };
