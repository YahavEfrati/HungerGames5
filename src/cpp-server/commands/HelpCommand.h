#ifndef HELPCOMMAND_H
#define HELPCOMMAND_H

#include "ICommand.h"
#include "../io/IOutput.h"
#include <memory>
#include <map>

class HelpCommand : public ICommand {
    private:
        // We use weak_ptr to break the circular dependency (with commands) and prevent memory leaks
        std::weak_ptr<std::map<std::string, std::shared_ptr<ICommand>>> commands;
    public: 
        HelpCommand(std::shared_ptr<std::map<std::string, std::shared_ptr<ICommand>>> cmds);
        Response execute(const Request& req) override;
        const std::string getDesc() override;
};

#endif