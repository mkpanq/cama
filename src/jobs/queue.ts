import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL!);
export const bankDataRetrievalQueue = new Queue("bank_data_retrieval", {
  connection,
  defaultJobOptions: {
    attempts: 5,
    removeOnComplete: true,
    removeOnFail: true,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});
