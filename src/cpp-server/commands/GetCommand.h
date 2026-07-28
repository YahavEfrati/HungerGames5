#ifndef GETCOMMAND_H
#define GETCOMMAND_H

#include "RecommendCommand.h"
#include "../io/IOutput.h" 
#include "../database/DataStore.h"

#include <vector>
#include <string>
#include <memory>

class GetCommand : public RecommendCommand {
public:
    GetCommand(std::shared_ptr<DataStore> ds);
    
    Response execute(const Request& req) override;
    
    const std::string getDesc() override;
};

#endif

