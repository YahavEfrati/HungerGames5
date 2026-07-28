#include "PostCommand.h"

PostCommand::PostCommand(std::shared_ptr<IDatabase> db, 
                         std::shared_ptr<DataStore> dataStore) 
    : AddCommand(db, dataStore){
}
Response PostCommand::execute(const Request& req) {
    const std::vector<std::string>& args = req.getArgs();
    // Validate argument count
    if(args.size() < 2) {
        return Response(400, "Bad Request");
    }
    std::string userId = args[0];
    // Check if user already exists
    if(dataStore->getUser(userId) != nullptr) {
        return Response(404, "Not Found");
    }
    // Call the base class logic to actually add the user and products
    AddCommand::execute(req);
    // Output success message
    return Response(201, "Created");
}

const std::string PostCommand::getDesc() {
    return "POST, arguments: [userid] [productid1] [productid2] …";
}