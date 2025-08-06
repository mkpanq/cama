import APP_CONFIG from "@/appConfig";
import { getCurrentApiToken } from "@/shared/apiToken/apiToken";
import bankDataApiRequest from "@/shared/bankDataApi.request";
import type Requisition from "./requisition.type";
import getDBClient from "@/db/client";
import { requisitionTable } from "@/db/schema/requisition";
import { getCurrentUser } from "@/shared/currentUser";

// TODO: Think about move all agreement + requisition data to single table and single row
// Only one requisition per institution + one agreement - easier to controll, manage, detele, etc.
// But what if something would broke during creation process - having created aggreement we could
// easily continue the whole process

export const requestForRequisition = async (
  institutionId: string,
  agreementId: string,
): Promise<string | null> => {
  try {
    const data = await bankDataApiRequest<{
      id: string;
      created: string;
      redirect: string;
      status: string;
      institution_id: string;
      agreement: string;
      reference: string;
      accounts: string[];
      user_language: string;
      link: string;
      ssn: string;
      account_selection: boolean;
      redirect_immediate: boolean;
    }>({
      method: "POST",
      path: APP_CONFIG.API_CONFIG.API_URL_CREATE_REQUISITION,
      auth: await getCurrentApiToken(),
      body: {
        redirect: `${process.env.HOSTNAME}${APP_CONFIG.ROUTE_CONFIG.API_CREATE_REQUISITION_WEBHOOK}`,
        institution_id: institutionId,
        agreement: agreementId,
        // TODO: For now I've decided to not create own reference
        // Due to need to immediete save this reference to DB
        // Because in other way we could not get req id in API route
        // Right now reference == requisitionId and let it be that way
        // reference: crypto.randomUUID(),
      },
    });

    // Throw error if status is rejected or it's expired (by any means)
    if (data.status === "RJ" || data.status === "EX")
      throw new Error("Can't request for new requisition");

    return data.link;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRequisitionFromApi = async (
  requisitionId: string,
): Promise<{
  requisition: Requisition;
  accounts: string[];
}> => {
  const data = await bankDataApiRequest<{
    id: string;
    created: string;
    redirect: string;
    status: string;
    institution_id: string;
    agreement: string;
    reference: string;
    accounts: string[];
    user_language: string;
    link: string;
    ssn: string;
    account_selection: boolean;
    redirect_immediate: boolean;
  }>({
    method: "GET",
    path: `${APP_CONFIG.API_CONFIG.API_URL_CREATE_REQUISITION}${requisitionId}`,
    auth: await getCurrentApiToken(),
  });

  if (data.status !== "LN") throw new Error("Requisition is not linked !");
  const user = await getCurrentUser();

  return {
    requisition: {
      id: data.id,
      userId: user.id,
      institutionId: data.institution_id,
      agreementId: data.agreement,
      created: new Date(data.created),
    },
    accounts: data.accounts,
  };
};

export const saveRequistionToDB = async (requisition: Requisition) => {
  const db = await getDBClient();

  try {
    const data = await db
      .insert(requisitionTable)
      .values(requisition)
      .returning({ id: requisitionTable.id });

    return data[0].id;
  } catch (error) {
    console.error(error);
    return null;
  }
};
