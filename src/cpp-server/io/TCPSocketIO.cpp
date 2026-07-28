#include "TCPSocketIO.h"
#include <sys/socket.h>
#include <unistd.h>
#include <iostream>


TCPSocketIO::TCPSocketIO(int fd) : client_socket(fd) {}


bool TCPSocketIO::getInput(std::string& out) {
    // Clear the output string before reading new input
    out.clear();
    
    char single_char;
    
    while (true) {
        // read one character at a time from the socket
        ssize_t bytes_received = recv(client_socket, &single_char, 1, 0);
        
        // if bytes_received is 0, it means the client has closed the connection
        if (bytes_received <= 0) {
            return false;
        }
        if (single_char == '\n') {
            break;
        }
        out += single_char;
    }
    
    return true;
}

void TCPSocketIO::giveOutput(const std::string& str) {
    std::string data_to_send = str + "\n"; // Append newline to indicate end of message
    size_t total_bytes_sent = 0; // Track total bytes sent to handle partial sends
    size_t data_length = data_to_send.size(); // Total length of the data to send
    const char* data_ptr = data_to_send.c_str(); // Pointer to the data to send

    // Loop until all data is sent, handling partial sends
    while (total_bytes_sent < data_length) {
        // Attempt to send the remaining data
        ssize_t bytes_sent = send(client_socket, data_ptr + total_bytes_sent, data_length - total_bytes_sent, 0);
        // If bytes_sent is less than or equal to 0, it indicates an error or that the client has closed the connection
        if (bytes_sent <= 0) {
            return;
        }
        total_bytes_sent += bytes_sent;
    }

}