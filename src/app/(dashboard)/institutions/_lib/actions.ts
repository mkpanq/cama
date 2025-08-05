"use server";

// Clicked on proper instituion, will create agreement and requisition  and save it to the DB
// Then, we'll save current requistion institution details to DB
// And after that we'll run background job for downloading all transactions and save it to DB

// After that operation, we'll be able to retreive all data from the database and (if we would like to) refetch / update them
// on demand from the dashboard

export async function createDataAccess() {
  console.log("Creating data access");
}
