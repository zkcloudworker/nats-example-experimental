import { zkCloudWorker, Cloud } from "zkcloudworker";
import { verify, Field, initializeBindings } from "o1js";

import { ExampleZkApp } from "./contract";

export class ExampleWorker extends zkCloudWorker {
  constructor(cloud: Cloud) {
    super(cloud);
  }

  public async execute(transactions: string[]): Promise<string | undefined> {
    let { value } = JSON.parse(transactions[0]);

    //this.cloud.log(`Generating the proof for value ${value}`);
    console.log(`Compiling zkApp ...`);
    const vk = (await ExampleZkApp.compile()).verificationKey;

    console.log(`Generating the proof for value ${value}`);
    const proof = await ExampleZkApp.check(Field(parseInt(value)));

    console.log(`Verifying the proof`);
    const verified = await verify(proof, vk);

    //this.cloud.log(`Verification result: ${verified}`);
    console.log(`Verification result: ${verified}`);
    return JSON.stringify(proof.toJSON(), null, 2);
  }
}

// Keep this for compatibility
export async function zkcloudworker(cloud: Cloud): Promise<zkCloudWorker> {
  await initializeBindings();
  return new ExampleWorker(cloud);
}
