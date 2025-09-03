import "server-only";
import { returnNewAgreement } from "./agreement/agreement.service";
import {
  createBankConnection,
  deleteConnection,
  getAll,
  getViaConnectionId,
  getViaReferenceId,
  updateRequisitionCreationDate,
} from "./bankConnection.repository";
import type BankConnection from "./bankConnection.type";
import { deleteRequisitionFromApi } from "./requisition/requisition.service";
import { getInstitutionDetails } from "../institution/institution.service";

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

  const { name, logo } = await getInstitutionDetails(institutionId);
  const createdBankConnection = await createBankConnection(
    bankConnectionAgreement,
    name,
    logo,
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
    institutionLogo: bankConnectionRecord.institutionLogo,
    institutionName: bankConnectionRecord.institutionName,
    agreement: {
      id: bankConnectionRecord.agreementId,
      institutionId: bankConnectionRecord.institutionId,
      maxHistoricalDays: bankConnectionRecord.maxHistoricalDays,
      createdDate: bankConnectionRecord.agreementCreationDate,
      expirationDate: bankConnectionRecord.agreementExpirationDate,
    },
  };
};

export const deleteBankConnection = async (
  bankConnectionId: string,
): Promise<string | undefined> => {
  const connection = await getViaConnectionId(bankConnectionId);

  const requisitionId = connection[0]?.requisitionId;
  if (!requisitionId) {
    console.error("No requisition found for the given bank connection ID");
    return;
  }

  await deleteRequisitionFromApi(requisitionId);

  const deletedId = await deleteConnection(bankConnectionId);

  return deletedId;
};

export const getAllActiveConnections = async (): Promise<BankConnection[]> => {
  const connections = await getAll();

  return connections.map((connection) => {
    return {
      id: connection.id,
      referenceId: connection.referenceId,
      requisitionId: connection.requisitionId,
      institutionLogo: connection.institutionLogo,
      institutionName: connection.institutionName,
      agreement: {
        id: connection.agreementId,
        institutionId: connection.institutionId,
        maxHistoricalDays: connection.maxHistoricalDays,
        createdDate: connection.agreementCreationDate,
        expirationDate: connection.agreementExpirationDate,
      },
    };
  });
};
