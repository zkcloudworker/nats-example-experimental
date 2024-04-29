#!/bin/bash

# pack the function
#(cp -r node_modules dist && cd dist && zip -r ../packed-lambda.zip .)
(rm -f packed-lambda.zip && cd dist && zip -r ../packed-lambda.zip .)

# pack the layer
(rm -f packed-layer.zip && cd layer && zip -r ../packed-layer.zip nodejs/)

ls -alh packed*
