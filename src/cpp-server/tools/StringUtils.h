/**
 * StringUtils is a utility class that provides static methods for manipulating
 * string data, by the demmand of the project requirements.
 */
#ifndef STRINGUTILS_H
#define STRINGUTILS_H
#include <string>
#include <vector>
#include <sstream>

class StringUtils {
private:
    StringUtils() = delete;
public:
    static std::vector<std::string> stringToVector(const std::string& inputString);
    static std::string vectorToString(const std::vector<std::string>& inputVector);
};

#endif