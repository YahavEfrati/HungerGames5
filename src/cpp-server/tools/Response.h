#ifndef RESPONSE_H
#define RESPONSE_H

#include <string>

/**
 * @brief Encapsulates a structured server response containing a status code, message, and body.
 */
class Response {
private:
    int statusCode;
    std::string statusMessage;
    std::string body;
    bool isRawBodyOnly;

public:
    /**
     * @brief Constructs a complete Response object.
     * @param code The numeric status code (e.g., 200, 201, 400, 404).
     * @param message The descriptive status message (e.g., "OK", "Created", "Bad Request").
     * @param responseBody The optional content/data to return to the client.
     * @param rawOnly Whether to return only the body without any additional formatting.
     */
    Response(int code, const std::string& message, const std::string& responseBody = "",bool rawOnly = false);

    /**
     * @brief Serializes the response into a standardized string format for network transmission.
     * @return Formatted string ending with the appropriate newlines according to system specs.
     */
    std::string serialize() const;

    // Getters used for testing or verification
    int getStatusCode() const;
    std::string getStatusMessage() const;
    std::string getBody() const;
};

#endif 