import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import bankDataApiRequest from "@/lib/shared/bankDataApi.request";
import type { Requisition, RequisitionApiResponse } from "./requisition.type";
import type { ErrorResponse } from "@/lib/shared/bankDataApi.type";

export const returnExisitingRequisitionDetails = async (id: string | null) => {
  try {
    if (!id) throw new Error("No requisition Id for existing bank connection");

    const requisitionData = await sendRequestForExistingRequisition(id);

    return {
      accounts: requisitionData.accounts,
      createdAt: new Date(requisitionData.created),
    };
  } catch (error) {
    console.error(error);
    return;
  }
};

export const returnNewRequisition = async (
  institutionId: string,
  agreementId: string,
  referenceId: string,
): Promise<Requisition | undefined> => {
  try {
    const requisitionData = await sendRequestForNewRequisition(
      institutionId,
      agreementId,
      referenceId,
    );

    return {
      id: requisitionData.id,
      link: requisitionData.link,
    };
  } catch (error) {
    console.error(error);
    return;
  }
};

const sendRequestForNewRequisition = async (
  institutionId: string,
  agreementId: string,
  referenceId: string,
): Promise<RequisitionApiResponse> => {
  const responseData = await bankDataApiRequest<RequisitionApiResponse>({
    method: "POST",
    path: APP_CONFIG.API_CONFIG.API_URL_CREATE_REQUISITION,
    auth: await getCurrentApiToken(),
    body: {
      redirect: `${process.env.APPLICATION_MAIN_URL}${APP_CONFIG.ROUTE_CONFIG.API_CREATE_REQUISITION_WEBHOOK}`,
      institution_id: institutionId,
      agreement: agreementId,
      reference: referenceId,
    },
  });

  if (!responseData.ok) {
    const errorMessage = JSON.stringify(responseData.data as ErrorResponse);
    throw new Error(`Failed to create requistion: ${errorMessage}`);
  }

  const requisitionData = responseData.data as RequisitionApiResponse;

  if (requisitionData.status === "RJ" || requisitionData.status === "EX")
    throw new Error(
      `Failed to create requistion: wrong requisition status - ${requisitionData.status}`,
    );

  return responseData.data as RequisitionApiResponse;
};

const sendRequestForExistingRequisition = async (id: string) => {
  const responseData = await bankDataApiRequest<RequisitionApiResponse>({
    method: "GET",
    path: APP_CONFIG.API_CONFIG.API_URL_GET_REQUISITION(id),
    auth: await getCurrentApiToken(),
  });

  if (!responseData.ok) {
    const errorMessage = JSON.stringify(responseData.data as ErrorResponse);
    throw new Error(`Failed to retrieve requistion: ${errorMessage}`);
  }
  const requisitionData = responseData.data as RequisitionApiResponse;

  if (requisitionData.status !== "LN")
    throw new Error("Requisition is not linked !");

  return responseData.data as RequisitionApiResponse;
};

export const deleteRequisitionFromApi = async (requisitionId: string) => {
  const responseData = await bankDataApiRequest<{
    summary: string;
    detail: string;
  }>({
    method: "DELETE",
    path: APP_CONFIG.API_CONFIG.API_URL_GET_REQUISITION(requisitionId),
    auth: await getCurrentApiToken(),
  });

  if (!responseData.ok) {
    const errorMessage = JSON.stringify(responseData.data as ErrorResponse);
    throw new Error(`Failed to delete requistion: ${errorMessage}`);
  }

  return true;
};
