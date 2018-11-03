#!/bin/bash
rm -R build/*  
cp -r node_modules data build/
zip -r build/index.zip data/* node_modules/* index.js
aws lambda update-function-code --function-name aura-helper-function --zip-file fileb://build/index.zip
