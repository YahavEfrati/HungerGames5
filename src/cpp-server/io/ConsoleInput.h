#ifndef CONSOLEINPUT_H
#define CONSOLEINPUT_H

#include "IInput.h"
#include <string>

class ConsoleInput : public IInput {
    public: 
        bool getInput(std::string& input);
};

#endif