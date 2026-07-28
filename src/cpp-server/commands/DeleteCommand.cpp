#include "DeleteCommand.h"
#include <sstream>
#include <unordered_set>

DeleteCommand::DeleteCommand(std::shared_ptr<IDatabase> db, std::shared_ptr<DataStore> ds) 
        : database(db), dataStore(ds) {}

Response DeleteCommand::execute(const Request& req) {
    const std::vector<std::string>& args = req.getArgs();
    // If we got less then 2 arguments, we return 400 bad request
    if(args.size() < 2){
        return Response(400, "Bad Request");
    }

    std::string userId = args[0];
    auto user = dataStore->getUser(userId);
    
    // Create set of seen products to make sure user won't delete same product twice.
    std::unordered_set<std::string> seenProducts;

    // If user does not exist, return 404 not found.
    if(user == nullptr){
        return Response(404, "Not Found");
    }

    // Check if all products belong to the user.
    for(size_t i = 1; i < args.size(); ++i ){
        // Check if we saw the product in the arguments.
        if(seenProducts.find(args[i]) != seenProducts.end()){
            return Response(404, "Not Found");
        }
        // Insert the cuurent product to the list of senn products.
        seenProducts.insert(args[i]);
        if(!user->hasProduct(args[i])){
            return Response(404, "Not Found");
        }
    }

    // Remove the products
    for(size_t i = 1; i < args.size(); ++i){
        user->removeProduct(args[i]);
    }

    std::ostringstream oss;
    for (const auto& pair : dataStore->getUsers()) {
        std::shared_ptr<User> currentUser = pair.second;
        oss << currentUser->getUserId();
        
        for (const auto& prodId : currentUser->getProducts()) {
            oss << " " << prodId;
        }
        oss << "\n";
    }

    std::string finalData = oss.str();
    database->overwrite(finalData);

    return Response(204, "No Content");
}

const std::string DeleteCommand::getDesc() {
    return "DELETE, arguments: [userid] [productid1] [productid2] …";
}