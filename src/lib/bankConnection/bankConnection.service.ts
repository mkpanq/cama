import "server-only";
import { returnNewAgreement } from "./agreement/agreement.service";
import {
  createBankConnection,
  getViaReferenceId,
  updateRequisitionCreationDate,
} from "./bankConnection.repository";
import type BankConnection from "./bankConnection.type";

export const initializeBankConnectionWithAgreement = async (
  institutionId: string,
  maxHistoricalDays: number,
  validFor: number,
): Promise<{
  institutionId: string;
  agreementId: string;
  referenceId: string;
}> => {
  const bankConnectionAgreement = await returnNewAgreement(
    institutionId,
    maxHistoricalDays,
    validFor,
  );
  if (!bankConnectionAgreement)
    throw new Error(
      "Cannot create bank connection - cannot retrieve end user agreement",
    );

  const createdBankConnection = await createBankConnection(
    bankConnectionAgreement,
  );
  if (!createdBankConnection)
    throw new Error("Cannot create bank connection - DB error during saving");

  return {
    institutionId: createdBankConnection.institutionId,
    agreementId: createdBankConnection.agreementId,
    referenceId: createdBankConnection.referenceId,
  };
};

export const updateRequisitionCreationDateForBankConnection = async (
  bankConnectionId: string,
  requisitionCreationDate: Date,
): Promise<void> => {
  const connectionId = await updateRequisitionCreationDate(
    bankConnectionId,
    requisitionCreationDate,
  );

  if (!connectionId)
    throw new Error(
      `Cannot update requisition id for connection: ${bankConnectionId}`,
    );
};

export const getExistingBankConnectionViaReferenceId = async (
  referenceId: string,
): Promise<BankConnection> => {
  const bankConnectionRecord = await getViaReferenceId(referenceId);
  if (!bankConnectionRecord) throw new Error("No bank connection found");

  return {
    id: bankConnectionRecord.id,
    referenceId: bankConnectionRecord.referenceId,
    requisitionId: bankConnectionRecord.requisitionId,
    agreement: {
      id: bankConnectionRecord.agreementId,
      institutionId: bankConnectionRecord.institutionId,
      maxHistoricalDays: bankConnectionRecord.maxHistoricalDays,
      createdDate: bankConnectionRecord.agreementCreationDate,
      expirationDate: bankConnectionRecord.agreementExpirationDate,
    },
  };
};
