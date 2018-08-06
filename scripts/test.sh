#! /usr/bin/env sh

export CI=true

cd packages/server
yarn test
cd ../../

cd packages/app
yarn test
cd ../../

cd packages/core
yarn test
