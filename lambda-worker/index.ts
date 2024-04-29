import { Handler } from "aws-lambda";
import { PrivateKey, initializeBindings } from "o1js";
import { connect, JSONCodec } from "nats";
import { JobData, LocalCloud } from "zkcloudworker";
import { CypherText } from "./src/encrypt";
import { zkcloudworker } from "./src/worker";

const NATS_SERVER = "nats.socialcap.dev:4222";

const codec = JSONCodec();

export async function runWorker(command: string, payload: string) {
  const timeCreated = Date.now();
  const job: JobData = {
    id: "local",
    jobId: "jobId",
    developer: "@dfst",
    repo: "lambda-simple-example",
    task: "example",
    userId: "userId",
    args: {},
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
  const result = await worker.execute([payload]);
  console.log("Job result:", result);
  return result;
}


export const handler: any = async (event, context) => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));
  console.log('LOGGER: ' + context.logStreamName);

  // we receive the web client address as an event param
  let { clientAddress } = event;

  // create the worker's private and public key
  const workerSecret = PrivateKey.random();
  let workerAddress = workerSecret.toPublicKey().toBase58();
  console.log("Worker address ", workerAddress);

  // connect to the NATS server and send a 'ready' request
  const nc = await connect({ servers: NATS_SERVER });
  const msg: any = await nc.request(
    `zkcw:${clientAddress}`, 
    codec.encode({
      "post": "ready",
      "params": { "key": workerAddress }
    })
  )
  const response: any = codec.decode(msg.data);
  console.log("Response: ", response);

  // disconect and clean all pendings
  await nc.drain();

  if (!response.success) return {
    statusCode: 200,
    body: JSON.stringify(response)
  }

  // Error decoding message:  Error: Could not encrypt message={} 
  // Error: Poseidon.Sponge(): bindings are not initialized, try calling `await initializeBindings()` first.
  // This shouldn't have happened and indicates an internal bug.
  await initializeBindings();
  
  // now we can decrypt the payload and execute given command
  let { command, payload } = response.data;
  let decryptedPayload = CypherText.decrypt(
    payload, 
    workerSecret.toBase58()
  );
  console.log("Command: ", command);
  console.log("Payload: ", decryptedPayload);
  let result = runWorker(command, decryptedPayload);

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };  
};


handler(
  { clientAddress: "B62qrYPDY555koJFAdNaUyw21WCNUgie9bmsBs2gCh6DSdhQmuN4qu6" }, 
  {}
).catch((error: any) => {
  console.log(error);
});


// runWorker("", '{"value": 5 }').catch((error: any) => {
//   console.log(error);
// });
