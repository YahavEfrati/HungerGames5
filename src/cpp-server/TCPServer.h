#ifndef TCP_SERVER_H
#define TCP_SERVER_H

#include <atomic>
#include <memory>
#include "database/DataStore.h"
#include "database/IDatabase.h"

/**
 * @class TCPServer
 * @brief A TCP server class that listens for incoming client connections and handles them using a shared DataStore
 */
class TCPServer {
protected:
    int port;
    int server_fd;
    std::atomic<bool> is_running;
    // DataStore is shared among all clients, so we use a shared pointer to manage its lifetime.
    std::shared_ptr<DataStore> dataStore; 
    std::shared_ptr<IDatabase> database;

    /**
    * @brief Handles a client connection
    * @param client_sock The socket file descriptor for the client connection
    * @note This method is virtual to allow for potential overrides in derived classes for handling clients in different ways (e.g., threading).
    */
    virtual void handleClient(int client_sock);
    
    /**
     * @brief Sets up the server socket and starts listening for connections
     * @return true if the server was set up successfully, false otherwise
     */
    bool setupServer();


public:
    /**
     * @brief Constructs a TCPServer instance
     * @param port The port number to listen on
        * @note The constructor is explicit to prevent implicit conversions from int to TCPServer.
     */
    explicit TCPServer(int port);

    /**
     * @brief Runs the TCP server
        * @note This method will block and run indefinitely until the server is stopped 
        and is virtual to allow for potential overrides in derived classes for threading.
     */
    virtual void run();

    /**
     * @brief Destructs the TCPServer instance
     */
    virtual ~TCPServer();
};

#endif