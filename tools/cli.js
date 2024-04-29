import { createLambdaFunction } from "./create-lambda.js";
import { updateLambdaFunction } from "./update-lambda.js";
import { invokeLambdaFunction } from "./invoke-lambda.js";

async function main(args) {
  const command = args[0];
  const functionName = args[1] || 'lambda-simple-example';
  const zipFile =  args[2] || 'packed-lambda.zip';
  switch (command) {
    case 'create': await createLambdaFunction(functionName, zipFile); break;
    case 'update': await updateLambdaFunction(functionName, zipFile); break;
    case 'invoke': await invokeLambdaFunction(functionName); break;
    default: throw Error("Invaild command or params");
  }
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
});
