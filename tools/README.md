# Simple CLI for deploy and invoke lambda examples

## Install dependendencies

~~~
yarn install
~~~

## Build code and layer zips

Cd to code folder, for example `../basic-lambda`:
```
yarn build
```

## Create and update lambda

Cd to code folder, for example `../basic-lambda`:
~~~
yarn cli create functionName packed-lambda.zip 
~~~

or:
~~~
yarn cli update functionName packed-lambda.zip 
~~~

## Invoke the function 

To invoke the function without any params, Cd to code folder, for example `../basic-lambda`:
~~~
yarn cli invoke functionName
~~~
