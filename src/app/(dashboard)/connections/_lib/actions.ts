"use server";

import { redirect } from "next/navigation";
import { deleteBankConnection } from "@/lib/bankConnection/bankConnection.service";
import APP_CONFIG from "@/lib/appConfig";

export async function removeBankConnection(formData: FormData) {
  const bankConnectionId = formData.get("bankConnectionId") as string;

  const deletedId = await deleteBankConnection(bankConnectionId);
  console.log(`Deleted Bank Connection ID: ${deletedId}`);

  redirect(APP_CONFIG.ROUTE_CONFIG.HOME_PATH);
}
