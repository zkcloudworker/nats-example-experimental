# Simple example Lambda

An AWS Lambda function running a ZkProgram.

## Install dependendencies
~~~
yarn install
~~~

**Important**: You need to have an AWS account, and setup and `.env` file with this options:
~~~
export AWS_ACCESS_KEY_ID=XXXX
export AWS_SECRET_ACCESS_KEY=XXXX
export AWS_REGION=
export AWS_ROLE_ARN=
~~~

## Build code and layer zips
```
yarn build
```

## Create and update lambda
~~~
yarn cli create simple-example-lambda packed-lambda.zip 
~~~

or update it:
~~~
yarn cli update simple-example-lambda packed-lambda.zip 
~~~

## Invoke the function 

To invoke the function without any params, Cd to code folder, for example `../basic-lambda`:
~~~
yarn cli invoke simple-example-lambda
~~~
