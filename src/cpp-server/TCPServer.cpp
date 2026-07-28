#include "TCPServer.h"
#include "io/TCPSocketIO.h"
#include "App.h"
#include "commands/CommandFactory.h"
#include "database/FileDatabase.h"
#include <cstring>
#include <sys/socket.h> 
#include <netinet/in.h>
#include <unistd.h>
#include <iostream>

TCPServer::TCPServer(int port)
 : port(port), server_fd(-1), is_running(false) {
    dataStore = std::make_shared<DataStore>();
    database = std::make_shared<FileDatabase>("/usr/src/HungerGames/data/dataBase.txt");
    database->read(dataStore);
 }

TCPServer::~TCPServer() {
    // Ensure the server socket is closed when the TCPServer instance is destroyed
    if (server_fd != -1) {
        close(server_fd);
    }
}

bool TCPServer::setupServer() {
    // Create a TCP socket
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) {
        return false;
    }

    // Set socket options to allow reuse of the address and port
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    if (bind(server_fd, (struct sockaddr *)&sin, sizeof(sin)) < 0) {
        return false;
    }

    if (listen(server_fd, 5) < 0) {
        return false;
    }

    return true;
}

void TCPServer::run() {
    // Set up the server socket and start listening for connections
    if (!setupServer()) {
        return;
    }

    is_running = true;
    while (is_running) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        // Accept a new client connection
        int client_sock = accept(server_fd, (struct sockaddr *)&client_sin, &addr_len);

        if (client_sock < 0) {
            continue;
        }
        // Handle the client connection in a separate method (potentially in a new thread for concurrency)
        handleClient(client_sock);
    }
}

void TCPServer::handleClient(int client_sock) {
    std::shared_ptr<TCPSocketIO> io = std::make_shared<TCPSocketIO>(client_sock);
    std::shared_ptr<IInput> input = io;
    std::shared_ptr<IOutput> output = io;

    // Create the command map for the client using the CommandFactory, passing in the shared database and dataStore
    CommandFactory factory(database, dataStore);
    auto commands = factory.createCommands();

    // Create and run the application for the client
    App app(input, output, *commands);
    app.run();
    close(client_sock);
}