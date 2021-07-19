#! /bin/sh

if [ ! -f last_call.pid ]; then
    touch last_call.pid
fi

PID=`cat last_call.pid`

kill -9 $PID

node Scripts/OpenTraffic.js >> logs.txt &

echo $! > last_call.pid