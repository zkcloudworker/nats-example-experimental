// Import the Lambda client from the AWS SDK
import "dotenv/config";
import fs from "fs";
import { LambdaClient, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda";

export { updateLambdaFunction };

// Function to update the Lambda function code
const updateLambdaFunction = async (functionName, zipFile) => {

  // Initialize the Lambda client
  const lambdaClient = new LambdaClient({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
  });

  // Replace 'YOUR_IAM_ROLE_ARN' with your actual IAM role ARN
  const roleArn = process.env.AWS_ROLE_ARN;

  // Function to convert the ZIP file to a buffer
  const zipFileBuffer = fs.readFileSync(zipFile);

  const params = {
    ZipFile: zipFileBuffer,
    FunctionName: functionName, // Name your Lambda function
    Handler: "index.handler", // The entry point in your function code
    Role: roleArn,
    Runtime: "nodejs20.x", // Specify the Node.js runtime version
    Description: `Lambda function ${functionName}`,
  };

  try {
    // Update the Lambda function code
    const data = await lambdaClient.send(new UpdateFunctionCodeCommand(params));
    // Log the result
    console.log("Lambda function code updated successfully:", data);
  } catch (error) {
    // Handle errors
    console.error("Error updating Lambda function code:", error);
  }
};
