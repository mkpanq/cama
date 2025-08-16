"use server";

import { updateAll } from "@/jobs/updateAll";

export async function syncBankData() {
  updateAll();
}
