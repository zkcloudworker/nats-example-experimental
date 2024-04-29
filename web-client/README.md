# A Lambda function using NATS.io

With NATS ww can establish a bidirectional connection between the web client
and the Lambda worker.

1. The web client will start the Lambda worker passing its publickKey to the worker.

2. Then it will create a subscription using its publicKey and will start 
  listening on posts on this channel.

3. When the worker is ready to start executing commands, it will post a 'ready'
  message on the client channel, with its own publicKey.

4. The client will reply to this message, by encrypting the payload using 
  the worker's publickKey and sending a response with the encrypted payload
  and the next command top execute.

5. When the worker receives the response, it will execute the given command
  with the given payload.

6. Finally, when the worker is done, it will post a 'done' message on the client
  channel, with the final results. That will end the exchange and close the
  connection.

## Install NATS server

NATS installed on `nats.socialcap.dev:4222` (temporary)

## Install dependencies

~~~
yarn install
~~~

## Start client 

It starts the client and waits for messages from the Lambda worker
~~~
yarn start
~~~


