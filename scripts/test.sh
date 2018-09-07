#! /usr/bin/env sh

export CI=true

cd packages/server
yarn test

server_ret=$?
cd ../../

cd packages/app
yarn test

app_ret=$?
cd ../../

cd packages/core
yarn test

core_ret=$?

if [ $server_ret -ne 0 ] || [ $app_ret -ne 0 ] || [ $core_ret -ne 0 ]; then
  exit 1
fi

exit 0
