// Create and save agreement - initialize bank connection
// Request for req -> save id and redirect
// When redirected from bank site to api -> get ref from url to get out already existing bankConnection and req id
// Get req data from API, update bank connection, create accounts

import "server-only";
import { requestForNewAgreement } from "./agreement/agreement.service";
import getDBClient from "@/db/client";
import { bankConnectionTable } from "@/db/schema/bankConnection";
import type BankConnection from "./bankConnection.type";
import { getCurrentUser } from "../shared/getCurrentUser";
import { eq } from "drizzle-orm";

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
  if (!bankConnectionAgreement)
    throw new Error(
      "Failed to initialize bank connection - cannot create agreement",
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
      agreementAcceptanceDate: new Date(bankConnectionAgreement.accepted),
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
