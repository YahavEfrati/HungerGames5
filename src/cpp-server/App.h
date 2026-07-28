#ifndef APP_H
#define APP_H

#include "commands/ICommand.h"
#include "io/IInput.h"
#include "io/IOutput.h"

#include <map>
#include <memory>
#include <string>


class App {
private:
    std::shared_ptr<IInput> input;
    std::shared_ptr<IOutput> output;
    std::map<std::string, std::shared_ptr<ICommand>> commands;

public:
    App(const std::shared_ptr<IInput>& input, 
        const std::shared_ptr<IOutput>& output,
        const std::map<std::string, std::shared_ptr<ICommand>>& commands);
    void run();
};

#endif