/**
 * IDatabase.h - Interface for database types.
 * Evry database of this type must now to to read data from the databae
 * to the system and to write data from the system to the database.
 */
#ifndef IDATABASE_H
#define IDATABASE_H
#include <string>
#include "DataStore.h"

class IDatabase {
    public:
        // Write a string to the database (e.g., a single line formatted for storage)
        virtual void write(const std::string& str) =0;
        // Read from the database and populate the provided DataStore object
        virtual void read(std::shared_ptr<DataStore> store) =0;
        // Overwrite the database
        virtual void overwrite(const std::string& data) =0;
        // Virtual destructor to ensure proper cleanup of derived classes
        virtual ~IDatabase() = default;
};
#endif
