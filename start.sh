#! /usr/bin/sh

script_dir=$(dirname $0)

cd "${script_dir}/client"
./node_modules/webpack/bin/webpack.js &> /dev/null &

cd "../"
cd "${script_dir}/server"
npm start &> /dev/null &

wait
