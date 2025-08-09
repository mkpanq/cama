import "server-only";
import { requestForNewAgreement } from "./agreement/agreement.service";
import getDBClient from "@/db/client";
import { bankConnectionTable } from "@/db/schema/bankConnection";
import type BankConnection from "./bankConnection.type";
import { getCurrentUser } from "../shared/getCurrentUser";
import { eq, and } from "drizzle-orm";
import { deleteRequisitionFromApi } from "./requisition/requisition.service";

export const initializeBankConnection = async (
  institutionId: string,
  maxHistoricalDays: number,
  validFor: number,
): Promise<BankConnection> => {
  const bankConnectionAgreement = await requestForNewAgreement(
    institutionId,
    maxHistoricalDays,
    validFor,
  );

  const db = await getDBClient();

  const currentUser = await getCurrentUser();
  const data = await db
    .insert(bankConnectionTable)
    .values({
      id: crypto.randomUUID(),
      referenceId: crypto.randomUUID(),
      userId: currentUser.id,
      institutionId,
      agreementId: bankConnectionAgreement.id,
      maxHistoricalDays,
      validFor,
      agreementCreationDate: new Date(bankConnectionAgreement.created),
      agreementExpirationDate: new Date(bankConnectionAgreement.expirationDate),
    })
    .returning();

  const bankConnection = data[0] as BankConnection;
  return bankConnection;
};

export const getBankConnectionViaReferenceId = async (
  referenceId: string,
): Promise<BankConnection> => {
  const db = await getDBClient();
  const bankConnection = await db
    .select()
    .from(bankConnectionTable)
    .where(eq(bankConnectionTable.referenceId, referenceId));

  return bankConnection[0] as BankConnection;
};

export const updateRequisitionIdForBankConnection = async (
  bankConnectionId: string,
  requisitionId: string,
): Promise<void> => {
  const db = await getDBClient();
  await db
    .update(bankConnectionTable)
    .set({ requisitionId: requisitionId })
    .where(eq(bankConnectionTable.id, bankConnectionId));
};

export const updateRequisitionCreationDateForBankConnection = async (
  bankConnectionId: string,
  requisitionCreationDate: Date,
): Promise<void> => {
  const db = await getDBClient();
  await db
    .update(bankConnectionTable)
    .set({ requisitionCreationDate: requisitionCreationDate })
    .where(eq(bankConnectionTable.id, bankConnectionId));
};

export const getAllConnectedInstitutions = async () => {
  const db = await getDBClient();
  const { id } = await getCurrentUser();
  const institutions = await db
    .select({
      id: bankConnectionTable.institutionId,
      bankConnectionId: bankConnectionTable.id,
    })
    .from(bankConnectionTable)
    .where(eq(bankConnectionTable.userId, id));

  return institutions.map((institution) => {
    return {
      id: institution.id,
      bankConnectionId: institution.bankConnectionId,
    };
  });
};

export const deleteBankConnection = async (
  bankConnectionId: string,
  institutionId: string,
): Promise<string> => {
  const db = await getDBClient();
  const data = await db
    .select({ id: bankConnectionTable.requisitionId })
    .from(bankConnectionTable)
    .where(
      and(
        // this institution removal is just in case
        eq(bankConnectionTable.id, bankConnectionId),
        eq(bankConnectionTable.institutionId, institutionId),
      ),
    );

  const requisitionId = data[0]?.id;
  if (!requisitionId) {
    console.error("No requisition found for the given bank connection ID");
    return;
  }

  const result = await deleteRequisitionFromApi(requisitionId);

  if (!result) {
    console.error("Failed to delete requisition from API");
    return;
  }

  const deletedId = await db
    .delete(bankConnectionTable)
    .where(eq(bankConnectionTable.id, bankConnectionId))
    .returning({ id: bankConnectionTable.id });

  return deletedId[0]?.id;
};
