#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H

#include <string>
#include "../database/IDatabase.h"
#include "../database/DataStore.h"
#include "ICommand.h"
#include <vector>
#include <memory>

class AddCommand : public ICommand {
protected:

    std::shared_ptr<IDatabase> database; 
    std::shared_ptr<DataStore> dataStore;
public:
    
    AddCommand(std::shared_ptr<IDatabase> db, std::shared_ptr<DataStore> dataStore);
    
    Response execute(const Request& req) override;
    const std::string getDesc() override;
};

#endif