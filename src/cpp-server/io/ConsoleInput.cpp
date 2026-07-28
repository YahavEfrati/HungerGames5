#include "ConsoleInput.h"
#include <iostream>

bool ConsoleInput::getInput(std::string& input) {
    return (bool)std::getline(std::cin, input);
}