"use server";

import { redirect } from "next/navigation";
import { requestForRequisition } from "../../../../lib/bankConnection/requisition/requisition.service";
import {
  deleteBankConnection,
  initializeBankConnection,
  updateRequisitionIdForBankConnection,
} from "@/lib/bankConnection/bankConnection.service";
import APP_CONFIG from "@/lib/appConfig";
import { updateAll } from "@/jobs/updateAll";

export async function syncBankData() {
  updateAll();
  redirect(APP_CONFIG.ROUTE_CONFIG.HOME_PATH);
}
