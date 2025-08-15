import "server-only";
import APP_CONFIG from "@/lib/appConfig";
import {
  getBalanceDataFromAPI,
  saveBalanceData,
} from "@/lib/balance/balance.service";
import { type Job, Queue, Worker } from "bullmq";
import { getCurrentApiToken } from "@/lib/shared/apiToken/apiToken.service";
import {
  completedLog,
  errorLog,
  failedLog,
  progressLog,
  redisConnection,
} from "./jobs.config";
import { getCurrentUser } from "@/lib/shared/supabaseServerClient";

const getAccountBalanceDataQueue = new Queue(
  APP_CONFIG.JOBS_CONFIG.QUEUES.BALANCES_QUEUE_NAME,
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

new Worker(
  APP_CONFIG.JOBS_CONFIG.QUEUES.BALANCES_QUEUE_NAME,
  async (
    job: Job<
      { accountId: string; userId: string; token: string },
      string[],
      string
    >,
  ) => {
    const { accountId, userId, token } = job.data;

    job.updateProgress(
      `Downloading balance data from API for account: ${accountId}`,
    );
    const balanceData = await getBalanceDataFromAPI(accountId, userId, token);

    job.updateProgress(
      `Data downloaded. Saving balance data for account: ${accountId}`,
    );
    const savedIds = await saveBalanceData(balanceData);
    return savedIds;
  },
  {
    connection: redisConnection,
    concurrency: APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_WORKER_CONCURRENCY,
  },
)
  .on("progress", (job, progress) => progressLog(job, progress))
  .on("error", (err) => errorLog(err))
  .on("failed", (job, failedReason) => failedLog(job, failedReason))
  .on("completed", (job) => completedLog(job));

// TODO: Not a fan of this solution when need to extract token and userId separately just for those methods
//  - will need to rethink implementation of strict job methods
export const addAccountBalanceDataRetrivalJob = async (accountId: string) => {
  const { id } = await getCurrentUser();
  const token = await getCurrentApiToken();

  await getAccountBalanceDataQueue.add(
    APP_CONFIG.JOBS_CONFIG.JOB_NAMES.BALANCES_JOB_NAME,
    {
      accountId,
      userId: id,
      token,
    },
  );
};
