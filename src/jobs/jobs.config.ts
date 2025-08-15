import type { Job, JobProgress } from "bullmq";
import { Redis } from "ioredis";

export const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const progressLog = (job: Job, progress: JobProgress) => {
  console.log(`[JOB::${job.id}::PROGRESS] ${progress}`);
};

export const failedLog = (job: Job | undefined, failedReason: Error) => {
  console.log(
    `[JOB::${job?.id ?? "UNKNOWN"}::FAILURE] ${failedReason.message}`,
  );
};

export const errorLog = (err: Error) => {
  console.error(`[ERROR::${err.name}] ${err.message}`);
};

export const completedLog = (job: Job) => {
  console.log(`[JOB::${job.id}::COMPLETE] ${job.name} has been completed`);
};

// TODO: Create separate "Job Method wrapper" to identify why some requests needs to have tokens and current user passed as an argument, instead of getting parsed from the method itself
