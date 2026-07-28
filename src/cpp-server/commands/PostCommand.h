#ifndef POSTCOMMAND_H
#define POSTCOMMAND_H

#include <string>
#include <vector>
#include <memory>
#include "../io/IOutput.h"
#include "AddCommand.h" 

// PostCommand inherits publicly from AddCommand
class PostCommand : public AddCommand {

public:
    PostCommand(std::shared_ptr<IDatabase> db, 
                std::shared_ptr<DataStore> dataStore);
    
    Response execute(const Request& req) override;
    
    const std::string getDesc() override;
};

#endif