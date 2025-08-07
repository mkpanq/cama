import { Job } from "bullmq";
import { bankDataRetrievalQueue } from "./queue";

const getBalanceDataJob = await Job.create(
  bankDataRetrievalQueue,
  "getBalanceData",
  () => {
    console.log("Let's get this data !");
  },
);

// TODO: I'm out for today:
// - Start creating workers (something like sidekiq)
// - create special jobs
// - be sure, that everything goes smoothly
