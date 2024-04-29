import { Handler } from "aws-lambda";
import { LocalCloud, JobData, Cloud, zkCloudWorker } from "zkcloudworker";
import { zkcloudworker } from "./src/worker";

export const handler: Handler = async (event, context) => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));
  console.log('LOGGER: ' + context.logStreamName);

  const timeCreated = Date.now();
  const job: JobData = {
    id: "local",
    jobId: "jobId",
    developer: "@dfst",
    repo: "lambda-simple-example",
    task: "example",
    userId: "userId",
    args: Math.ceil(Math.random() * 100).toString(),
    metadata: "simple-example",
    txNumber: 1,
    timeCreated,
    timeCreatedString: new Date(timeCreated).toISOString(),
    timeStarted: timeCreated,
    jobStatus: "started",
    maxAttempts: 0,
  } as JobData;
  
  const cloud = new LocalCloud({ 
    job, 
    chain: "local", 
    localWorker: zkcloudworker 
  });

  const worker = await zkcloudworker(cloud);
  console.log("Executing job...");
  console.log("Job:", JSON.stringify(job, null, 2));
  const result = await worker.execute([]);
  console.log("Job result:", result);

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };  
};
