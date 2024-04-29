import { connect, JSONCodec, StringCodec } from "nats";
import { PrivateKey, initializeBindings } from "o1js";
import { CypherText } from './src/encrypt';

const NATS_SERVER = "nats.socialcap.dev:4222";

function listen(connection: any, subject: string) {
  // Create a JSON codec for encoding and decoding messages
  const codec = JSONCodec();

  let workerKey: string = "";

  // Subscribe to the subject
  const subscription = connection.subscribe(subject);
  console.log(`Subscribed to subject ${subject}`);

  // Process messages received on the subscribed subject
  (async () => {

    // Error decoding message:  Error: Could not encrypt message={} 
    // Error: Poseidon.Sponge(): bindings are not initialized, try calling `await initializeBindings()` first.
    // This shouldn't have happened and indicates an internal bug.
    await initializeBindings();
    
    for await (const msg of subscription) {
      try {
        const data: any = codec.decode(msg.data);
        console.log(`Received message on subject ${subject}:`, data);

        // Perform processing logic here
        const { post, params } = data;
        console.log(`Post: `, post, params);
        switch (post) {

          case 'ready': {
            // the workers announces it is ready 
            // and we receive the worker's publicKey
            workerKey = params.key || "";
            console.log("Worker publicKey: ", workerKey);

            // we will use its key to encrypt the message
            const encryptedPayload = CypherText.encrypt(
              JSON.stringify({ 
                value: Math.ceil(Math.random() * 100).toString() 
              }),
              workerKey
            );
            console.log("Encrypted payload: ", encryptedPayload);

            // we reply with the command we want the worker to execute
            // and with the encrypted payload 
            msg.respond(codec.encode({ 
              success: true,
              data: {
                command: "execute",
                payload: encryptedPayload,
              },
              error: undefined
            }));
          }

          case 'done': {
            msg.respond(codec.encode({ 
              response: {
                status: 'closed'
              } 
            }));
          }
        }
      }
      catch (err) {
        console.error('Error decoding message: ', err);
      }
    }
  })();
}

async function main(args: string[]) {
  const nc = await connect({ servers: NATS_SERVER });

  // create some client address, this will be done by 
  // the web API when calling a worker
  const clientSecret = PrivateKey.random();
  let clientAddress = clientSecret.toPublicKey().toBase58();
  console.log("Cliente address ", clientAddress);
  
  clientAddress = "B62qrYPDY555koJFAdNaUyw21WCNUgie9bmsBs2gCh6DSdhQmuN4qu6";
  
  // now subscribe and listen in this Address
  listen(nc, `zkcw:${clientAddress}`);

  // we want to insure that messages that are in flight
  // get processed, so we are going to drain the
  // connection. Drain is the same as close, but makes
  // sure that all messages in flight get seen
  // by the iterator. After calling drain on the connection
  // the connection closes.
  //await nc.drain();  
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
});