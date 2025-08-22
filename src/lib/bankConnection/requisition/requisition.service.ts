import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import bankDataApiRequest from "@/lib/shared/bankDataApi.request";
import { getCurrentUser } from "@/lib/shared/supabaseServerClient";
import type Requisition from "./requisition.type";
import type BankConnection from "../bankConnection.type";

export const requestForRequisition = async (
  bankConnection: BankConnection,
): Promise<{
  requisitionId: string;
  redirectLink: string;
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
    method: "POST",
    path: APP_CONFIG.API_CONFIG.API_URL_CREATE_REQUISITION,
    auth: await getCurrentApiToken(),
    body: {
      redirect: `${process.env.APPLICATION_MAIN_URL}${APP_CONFIG.ROUTE_CONFIG.API_CREATE_REQUISITION_WEBHOOK}`,
      institution_id: bankConnection.institutionId,
      agreement: bankConnection.agreementId,
      reference: bankConnection.referenceId,
    },
  });

  // Throw error if status is rejected or it's expired (by any means)
  if (data.status === "RJ" || data.status === "EX")
    throw new Error(
      `Can't request for new requisition - wrong requisition status: -${data.status}`,
    );

  return {
    requisitionId: data.id,
    redirectLink: data.link,
  };
};

export const getRequisitionFromApi = async (
  requisitionId: string,
): Promise<{
  requisitionDetails: Requisition;
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
    path: APP_CONFIG.API_CONFIG.API_URL_GET_REQUISITION(requisitionId),
    auth: await getCurrentApiToken(),
  });

  if (data.status !== "LN") throw new Error("Requisition is not linked !");
  const user = await getCurrentUser();

  return {
    requisitionDetails: {
      id: data.id,
      userId: user.id,
      institutionId: data.institution_id,
      agreementId: data.agreement,
      created: new Date(data.created),
    },
    accounts: data.accounts,
  };
};

export const deleteRequisitionFromApi = async (requisitionId: string) => {
  try {
    await bankDataApiRequest<{
      summary: string;
      detail: string;
    }>({
      method: "DELETE",
      path: APP_CONFIG.API_CONFIG.API_URL_GET_REQUISITION(requisitionId),
      auth: await getCurrentApiToken(),
    });
  } catch (error) {
    console.error(`Error deleting requisition ${requisitionId}: `, error);
    return false;
  }

  return true;
};
