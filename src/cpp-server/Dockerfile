FROM gcc:13

RUN apt-get update && \
    apt-get install -y \
    cmake \
    python3 \
    netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/HungerGames

COPY data ./data
COPY src/cpp-server ./src/cpp-server
COPY src/client ./src/client
COPY tests ./tests

WORKDIR /usr/src/HungerGames/src/cpp-server

RUN mkdir -p build

WORKDIR /usr/src/HungerGames/src/cpp-server/build

RUN cmake .. && make

WORKDIR /usr/src/HungerGames/src/cpp-server

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]