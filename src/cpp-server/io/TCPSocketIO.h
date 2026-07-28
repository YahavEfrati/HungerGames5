#ifndef TCP_SOCKET_IO_H
#define TCP_SOCKET_IO_H

#include <string>
#include "IInput.h"
#include "IOutput.h"

/**
 * @class TCPSocketIO
 * @brief Implementation of the IInput and IOutput interfaces for handling TCP socket I/O operations.
 */
class TCPSocketIO : public IInput, public IOutput {
private:
    int client_socket;

public:
    /**
     * @brief Constructs a new TCPSocketIO object with the given client socket file descriptor.
     * @param fd The file descriptor for the client socket to be used for I/O operations.
        * @note Marked as explicit to prevent implicit conversion from int.
     */
    explicit TCPSocketIO(int fd);

    /**
     * @brief Gets input from the TCP socket.
     * @param input The string to store the input in.
     * @return True if input was successfully retrieved, false otherwise.
     */
    bool getInput(std::string& input) override;

    /**
     * @brief Gives output to the TCP socket.
     * @param text The string to send as output.
     */
    void giveOutput(const std::string& text) override;
};

#endif