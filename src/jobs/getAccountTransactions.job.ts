import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import { type Job, Queue, Worker } from "bullmq";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import {
  getBookedTransactionsDataFromAPI,
  saveTransactionsDataToDB,
} from "@/lib/transaction/transaction.service";
import {
  completedLog,
  errorLog,
  failedLog,
  progressLog,
  redisConnection,
} from "./jobs.config";
import { updateLastSyncDate } from "@/lib/account/account.service";

const getAccountTransactionDataQueue = new Queue(
  APP_CONFIG.JOBS_CONFIG.QUEUES.TRANSACTIONS_QUEUE_NAME,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: "fixed",
        delay: 3000,
      },
    },
  },
);

// TODO: Remember to improve Error handling - thanks to that we would know what happened in the background jobs
new Worker(
  APP_CONFIG.JOBS_CONFIG.QUEUES.TRANSACTIONS_QUEUE_NAME,
  async (
    job: Job<
      { accountId: string; userId: string; token: string },
      string[],
      string
    >,
  ) => {
    const { accountId, token } = job.data;

    job.updateProgress(
      `Downloading transactions from API for account: ${accountId}`,
    );

    const transactions = await getBookedTransactionsDataFromAPI(
      accountId,
      token,
    );

    job.updateProgress(
      `Transaction data downloaded. Saving data transactions for account: ${accountId}`,
    );
    const savedTransactionsIds = await saveTransactionsDataToDB(transactions);

    return savedTransactionsIds;
  },
  {
    connection: redisConnection,
    concurrency: APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_WORKER_CONCURRENCY,
  },
)
  .on("progress", (job, progress) => progressLog(job, progress))
  .on("error", (err) => errorLog(err))
  .on("failed", (job, failedReason) => failedLog(job, failedReason))
  .on("completed", (job) => {
    completedLog(job);
    updateLastSyncDate(job.data.accountId);
  });

export const addAccountTransactionDataRetrivalJob = async (
  accountId: string,
) => {
  const token = await getCurrentApiToken();

  await getAccountTransactionDataQueue.add(
    APP_CONFIG.JOBS_CONFIG.JOB_NAMES.TRANSACTIONS_JOB_NAME,
    {
      accountId,
      token,
    },
  );
};
