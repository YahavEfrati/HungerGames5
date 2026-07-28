#ifndef PATCHCOMMAND_H
#define PATCHCOMMAND_H

#include <string>
#include <vector>
#include <memory>
#include "../io/IOutput.h"
#include "AddCommand.h" 

// PatchCommand inherits publicly from AddCommand
class PatchCommand : public AddCommand {

public:
    PatchCommand(std::shared_ptr<IDatabase> db, 
                 std::shared_ptr<DataStore> dataStore);
    
    Response execute(const Request& req) override;
    
    const std::string getDesc() override;
};

#endif