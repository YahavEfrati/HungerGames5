#ifndef IINPUT_H
#define IINPUT_H
#include <string>

class IInput {
public:
    virtual bool getInput(std::string& input) = 0;
    virtual ~IInput(){}
};

#endif
