#ifndef DELETECOMMAND_H
#define DELETECOMMAND_H

#include "ICommand.h"
#include "../io/IOutput.h"
#include "../database/IDatabase.h"
#include "../database/DataStore.h"
#include <memory>
#include <vector>
#include <string>

class DeleteCommand : public ICommand {
private:
    std::shared_ptr<IDatabase> database;
    std::shared_ptr<DataStore> dataStore;
    
    public:
    DeleteCommand(std::shared_ptr<IDatabase> db, std::shared_ptr<DataStore> ds);
    
    Response execute(const Request& req) override;
    
    const std::string getDesc() override;
};

#endif