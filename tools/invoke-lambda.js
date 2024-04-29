import "dotenv/config";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export { invokeLambdaFunction };

// Function to invoke the Lambda function
const invokeLambdaFunction = async (functionName) => {

  // Initialize the Lambda client
  const lambdaClient = new LambdaClient({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
  });

  // Specify the function name and ARN of the Lambda function you want to invoke
  const functionArn = process.env.AWS_ROLE_ARN;

  // Create parameters for the Invoke command
  const params = {
    FunctionName: functionName,
    InvocationType: "RequestResponse", // Change to "Event" for asynchronous invocation
    // Payload: '{"key": "value"}', // Optional payload
  };

  try {
    // Invoke the Lambda function
    const t0 = Date.now();
    console.log(`Started ${(new Date()).toUTCString()}`)
    const data = await lambdaClient.send(new InvokeCommand(params));

    // Parse and log the response
    const t1 = Date.now();
    const responsePayload = JSON.parse(Buffer.from(data.Payload).toString());
    
    console.log(`Ended ${(new Date()).toUTCString()}`)
    console.log("Lambda function response:", responsePayload);
    console.log(`Lambda function duration: ${(t1 - t0)/1000} secs`);
  } catch (error) {
    // Handle errors
    console.error("Error invoking Lambda function:", error);
  }
};
