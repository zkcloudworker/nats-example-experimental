#!/bin/bash

# pack the function
(rm -f packed-lambda.zip && cd dist && zip -r ../packed-lambda.zip .)

# pack the layer
(rm -f packed-layer.zip && cd layer && zip -r ../packed-layer.zip nodejs/)

ls -alh packed*
