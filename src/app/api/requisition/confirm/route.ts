import {
  getRequisitionFromApi,
  saveRequistionToDB,
} from "@/app/(dashboard)/institutions/_lib/requisition";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requisitionId = url.searchParams.get("ref");

  // TODO: Think about better erroring strategy
  if (!requisitionId) return;
  const requisitionWithAccounts = await getRequisitionFromApi(requisitionId);
  const requsitionId = await saveRequistionToDB(
    requisitionWithAccounts.requisition,
  );
  if (!requsitionId) throw new Error("RequsitionId could not be saved");

  return new Response(
    JSON.stringify({ accounts: requisitionWithAccounts.accounts }),
  );
  // Ask for accounts
  // Save accounts to DB
  // Start downloading all accounts data to DB - transaction, details, balances etc
}
