#include "StringUtils.h"

// Converts a string into a vector of strings,
// And ignores spaces.
std::vector<std::string> StringUtils::stringToVector(const std::string& inputString) {
    std::vector<std::string> result;
	std::stringstream inputStream(inputString);
	std::string word;
	
	while(getline(inputStream, word, ' ')) {

        // Remove potential trailing '\r' caused by Windows line endings
        if (!word.empty() && word.back() == '\r') {
            word.pop_back();
        }

		if(!word.empty())
			result.push_back(word);
	}
    return result;
}

// Converts a vector of strings into a single space-separated string.
std::string StringUtils::vectorToString(const std::vector<std::string>& inputVector) {
	std::string result;
	size_t size = inputVector.size();
	for(size_t i=0; i< size; i++){
		if(i>0)  // we dont need space before the first word
			result.append(" ");
		result.append(inputVector[i]);
	}
	return result;
	
}