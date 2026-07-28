#ifndef IOUTPUT_H
#define IOUTPUT_H
#include <string>

class IOutput {

    public:
    virtual void giveOutput(const std::string& text) = 0;
    virtual ~IOutput() {};
};
#endif