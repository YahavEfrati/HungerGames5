#ifndef REQUEST_H
#define REQUEST_H

#include <string>
#include <vector>

/**
 * @brief Represents an incoming client request parsed from a raw socket string.
 */
class Request {
private:
    std::string method;
    std::vector<std::string> args;

public:
    /**
     * @brief Constructs a Request object by parsing the raw input string.
     * @param rawInput The raw request string received from the client socket.
     */
    Request(const std::string& rawInput);

    /**
     * @brief Gets the HTTP/Custom method of the request.
     * @return The method string (e.g., "GET", "POST", "PATCH").
     */
    std::string getMethod() const;

    /**
     * @brief Gets the list of arguments associated with the request.
     * @return A const reference to the vector of argument strings.
     */
    const std::vector<std::string>& getArgs() const;
};

#endif