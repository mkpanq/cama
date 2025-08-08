import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import {
  getBalanceDataFromAPI,
  saveBalanceDataToDB,
} from "@/lib/balance/balance.service";
import { type Job, Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { getCurrentUser } from "@/lib/shared/getCurrentUser";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import { getMaxHistoricalDays } from "@/lib/account/account.service";
import {
  getBookedTransactionsDataFromAPI,
  saveTransactionsDataToDB,
} from "@/lib/transaction/transaction.service";

const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const getAccountDataQueue = new Queue(
  APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_QUEUE_NAME,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 5,
      removeOnComplete: true,
      removeOnFail: true,
      backoff: {
        type: "fixed",
        delay: 3000,
      },
    },
  },
);

// TODO: Remember to improve Error handling - thanks to that we would know what happened in the
// background jobs

new Worker(
  APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_QUEUE_NAME,
  async (
    job: Job<
      { accountId: string; userId: string; token: string },
      string[],
      string
    >,
  ) => {
    const { accountId, userId, token } = job.data;

    // TODO: Unify job log messages
    job.updateProgress(`Downloading data from API for account: ${accountId}`);
    const balanceData = await getBalanceDataFromAPI(accountId, userId, token);

    job.updateProgress(
      `Data downloaded. Saving data for account: ${accountId}`,
    );
    const savedIds = await saveBalanceDataToDB(balanceData);

    const maxDays = await getMaxHistoricalDays(accountId);
    job.updateProgress(
      `Balance data for ids: ${savedIds} saved.\nDownloading transactions from ${maxDays} days for account: ${accountId}`,
    );

    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // TODO: Need to separate balance from transactions jobs - in case of error balances are duplicating...
    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------

    const transactions = await getBookedTransactionsDataFromAPI(
      accountId,
      userId,
      token,
      maxDays,
    );

    job.updateProgress(
      `Data downloaded. Saving data transactions for account: ${accountId}`,
    );
    const savedTransactionsIds = await saveTransactionsDataToDB(transactions);

    return savedTransactionsIds;
  },
  {
    connection: redisConnection,
    concurrency: APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_WORKER_CONCURRENCY,
  },
)
  .on("progress", (job, progress) => {
    console.log(`Job (#${job.id}): ${progress}`);
  })
  .on("error", (err) => {
    console.error(`ERROR ${err.message}`);
  })
  .on("failed", (job, failedReason) => {
    console.log(`Job (#${job?.id}) FAILED: ${failedReason}`);
  })
  .on("completed", (job, returnValue) => {
    console.log(
      `Job '${APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_JOB_NAME}' (#${job.id}) has completed and returned saved balances with IDs: ${returnValue}`,
    );
  });

export const addAccountDataRetrivalJob = async (accountId: string) => {
  // TODO: Not a fan of this solution when need to extract token and userId separately just for those methods
  //  - will need to rethink implementation of strict job methods
  const { id } = await getCurrentUser();
  const token = await getCurrentApiToken();

  await getAccountDataQueue.add(APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_JOB_NAME, {
    accountId,
    userId: id,
    token,
  });
};
