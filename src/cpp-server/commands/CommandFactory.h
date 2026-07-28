#ifndef COMMANDFACTORY_H
#define COMMANDFACTORY_H

#include <map>
#include <string>
#include <memory>
#include "ICommand.h"
#include "../io/IOutput.h"
#include "../database/IDatabase.h"
#include "../database/DataStore.h"

/**
 * @class CommandFactory
 * @brief A factory class responsible for creating and managing command instances based on the ICommand interface.
 */
class CommandFactory {
private:
    std::shared_ptr<IDatabase> database;
    std::shared_ptr<DataStore> dataStore;

public:
    CommandFactory(std::shared_ptr<IDatabase> db, std::shared_ptr<DataStore> ds);

    /**
     * @brief Creates a map of command names to their corresponding ICommand instances.
     * @return A shared pointer to a map where the key is the command name (e.g., "get", "post") and the value is a shared pointer to
     */
    std::shared_ptr<std::map<std::string, std::shared_ptr<ICommand>>> createCommands() const;
};

#endif