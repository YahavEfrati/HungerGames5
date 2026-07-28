#include "Response.h"

Response::Response(int code, const std::string& message, const std::string& responseBody, bool rawOnly)
    : statusCode(code), statusMessage(message), body(responseBody), isRawBodyOnly(rawOnly) {}

std::string Response::serialize() const {
    // if the response is marked as raw body only, we return just the body without any status line or formatting.
    if (isRawBodyOnly) {
        return body;
    }
    // Start with the status line (e.g., "400 Bad Request" or "200 OK")
    std::string output = std::to_string(statusCode) + " " + statusMessage;
    
    // If a body exists, append it on a new line right after the status
    if (!body.empty()) {
        output += "\n" + body;
    }
    
    return output;
}

int Response::getStatusCode() const {
    return statusCode;
}

std::string Response::getStatusMessage() const {
    return statusMessage;
}

std::string Response::getBody() const {
    return body;
}