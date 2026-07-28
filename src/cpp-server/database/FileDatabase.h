#ifndef FILEDATABASE_H
#define FILEDATABASE_H
#include "IDatabase.h"
#include <memory>
/**
 * @class FileDatabase
 * @brief Implementation of the IDatabase interface using a local text file.
 * * This class handles the persistent storage of the system by reading from and
 * writing to a specific text file. Each line in the file represents a user
 * and their associated products.
 */
class FileDatabase : public IDatabase {
    private:
        std::string fileName; // The path/name of the file used for storage.
    public:
    /**
     * @brief Constructs a new File Database object.
     * * @param name The name or path of the text file to be used.
     * @note Marked as explicit to prevent implicit conversion from std::string.
     */
    explicit FileDatabase(std::string name);

    /**
     * @brief Appends a formatted string to the database file.
     * * Usually called when a new user-product association needs to be saved.
     * @param str The formatted string to be written (e.g., "userID productID1 productID2").
     */
    void write(const std::string& str) override;

    /**
     * @brief Reads the entire file and populates the provided DataStore.
     * * Parses the file line by line, creating User objects and adding them 
     * to the DataStore along with their products.
     * * @param store A shared pointer to the DataStore that will hold the loaded data.
     */
    void read(std::shared_ptr<DataStore> store) override;

    /**
     * @brief over write the data file
     * @param str The string we want to write to the file
     */
    void overwrite(const std::string& data) override;
};

#endif