#ifndef RECOMMENDCOMMAND_H
#define RECOMMENDCOMMAND_H

#include "ICommand.h"
#include "../io/IOutput.h"
#include "../database/DataStore.h"
#include <memory>
#include <vector>
#include <string>

class RecommendCommand : public ICommand {
protected:
    std::shared_ptr<DataStore> dataStore; 

public:
    RecommendCommand(std::shared_ptr<DataStore> ds);
    
    Response execute(const Request& req) override;
    const std::string getDesc() override;
};

#endif
