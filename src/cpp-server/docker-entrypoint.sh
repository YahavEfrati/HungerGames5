#!/bin/bash

MODE=$1

if [ "$MODE" = "server" ]; then

    PORT=$2

    ./build/HungerGamesApp $PORT

elif [ "$MODE" = "client" ]; then

    IP=$2
    PORT=$3

    python3 ../client/client.py $IP $PORT

elif [ "$MODE" = "tests" ]; then

    ./build/runTests

fi