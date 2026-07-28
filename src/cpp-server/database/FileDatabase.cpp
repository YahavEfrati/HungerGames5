#include "FileDatabase.h"
#include "../models/User.h"
#include "../models/Product.h"
#include "DataStore.h"
#include <fstream>
#include <sstream>

FileDatabase::FileDatabase(std::string name) : fileName(name) {}

void FileDatabase::write(const std::string& str) {
    // open the file in append mode.
    std::ofstream outFile(fileName, std::ios::app);

    // making sure the file is successfully opened.
    if(outFile.is_open()) {
        outFile << str << "\n";
        outFile.close();
    }
}

void FileDatabase::read(std::shared_ptr<DataStore> store) {
    // open the file for reading
    std::ifstream inFile(fileName);

    // check if file exist
    if(!inFile.is_open()){
        return;
    }

    std::string line;

    while (std::getline(inFile, line)){
        // skip empty lines.
        if(line.empty()) continue;

        // break the line by spaces
        std::istringstream iss(line);
        std::string userId;

        // if line does not contains only spaces.
        if(iss >> userId) {
            std::set<std::string> productId;
            std::string pId;

            // while there are still products to add' we will add them to our set.
            while (iss >> pId){
                productId.insert(pId);
            }

            // Removed the if(!productId.empty()) condition.
            // We must add the user to the store even if they have 0 products,
            // so they are loaded into memory and POST commands will correctly identify them as existing.
            store->add(userId, productId);
            
        }
    }
    inFile.close();
}

void FileDatabase::overwrite(const std::string& data) {
    std::ofstream outFile(fileName);

    if(outFile.is_open()) {
        outFile << data; 
    }
}

