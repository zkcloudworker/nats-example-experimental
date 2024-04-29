import { zkCloudWorker, Cloud } from "zkcloudworker";
import { verify, Field } from "o1js";

import { ExampleZkApp } from "./contract";

export class ExampleWorker extends zkCloudWorker {
  constructor(cloud: Cloud) {
    super(cloud);
  }

  public async execute(transactions: string[]): Promise<string | undefined> {
    if (this.cloud.args === undefined) throw new Error("args is undefined");
    const value = parseInt(this.cloud.args);
    //this.cloud.log(`Generating the proof for value ${value}`);
    console.log(`Generating the proof for value ${value}`);
    const vk = (await ExampleZkApp.compile()).verificationKey;
    const proof = await ExampleZkApp.check(Field(value));
    const verified = await verify(proof, vk);
    //this.cloud.log(`Verification result: ${verified}`);
    console.log(`Verification result: ${verified}`);
    return JSON.stringify(proof.toJSON(), null, 2);
  }
}

// Keep this for compatibility
export async function zkcloudworker(cloud: Cloud): Promise<zkCloudWorker> {
  return new ExampleWorker(cloud);
}

