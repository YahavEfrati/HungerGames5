#include "CommandFactory.h"
#include "DeleteCommand.h"
#include "GetCommand.h"
#include "PostCommand.h"
#include "PatchCommand.h"
#include "HelpCommand.h"


CommandFactory::CommandFactory(std::shared_ptr<IDatabase> db, std::shared_ptr<DataStore> ds)
    : database(db), dataStore(ds) {}


std::shared_ptr<std::map<std::string, std::shared_ptr<ICommand>>> 
CommandFactory::createCommands() const {
    
    auto commands = std::make_shared<std::map<std::string, std::shared_ptr<ICommand>>>();
    
    (*commands)["get"] = std::make_shared<GetCommand>(dataStore);
    (*commands)["post"] = std::make_shared<PostCommand>(database, dataStore);
    (*commands)["delete"] = std::make_shared<DeleteCommand>(database, dataStore);
    (*commands)["patch"] = std::make_shared<PatchCommand>(database, dataStore);
    (*commands)["help"] = std::make_shared<HelpCommand>(commands);
    
    return commands;
}