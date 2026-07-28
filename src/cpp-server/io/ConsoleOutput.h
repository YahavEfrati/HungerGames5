#ifndef CONSOLEOUTPUT_H
#define CONSOLEOUTPUT_H

#include "IOutput.h"
#include <string>

class ConsoleOutput : public IOutput {
    public: 
        void giveOutput(const std::string& text);
};

#endif