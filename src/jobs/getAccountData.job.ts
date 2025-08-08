import APP_CONFIG from "@/lib/appConfig";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

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
        type: "exponential",
        delay: 5000,
      },
    },
  },
);

new Worker(
  APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_QUEUE_NAME,
  async (job) => {
    const data = job.data;
    console.log(data);
  },
  {
    connection: redisConnection,
    concurrency: APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_WORKER_CONCURRENCY,
  },
);

export const addAccountDataRetrivalJob = async (accountId: string) => {
  // const job = await getAccountDataJob(accountId);
  await getAccountDataQueue.add(APP_CONFIG.JOBS_CONFIG.ACCOUNT_DATA_JOB_NAME, {
    accountId,
  });
};
