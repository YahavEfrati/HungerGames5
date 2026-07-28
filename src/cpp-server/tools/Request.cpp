#include "Request.h"
#include "StringUtils.h"


Request::Request(const std::string& rawInput) {
    // Use StringUtils to parse the raw input into method and arguments
    std::vector<std::string> tokens = StringUtils::stringToVector(rawInput);
    
    if (!tokens.empty()) {
        method = tokens[0];  // The first token is the method
        if (tokens.size() > 1) {
            // The remaining tokens are the arguments
            args.assign(tokens.begin() + 1, tokens.end());
        }
    }
}

std::string Request::getMethod() const {
    return method;
}

const std::vector<std::string>& Request::getArgs() const {
    return args;
}