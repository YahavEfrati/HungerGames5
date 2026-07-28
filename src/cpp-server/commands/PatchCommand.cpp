#include "PatchCommand.h"

PatchCommand::PatchCommand(std::shared_ptr<IDatabase> db, 
                            std::shared_ptr<DataStore> dataStore) 
    : AddCommand(db, dataStore) {
}
Response PatchCommand::execute(const Request& req) {
    const std::vector<std::string>& args = req.getArgs();
    // Validate argument count
    if(args.size() < 2) {
        return Response(400, "Bad Request");
    }
    std::string userId = args[0];
    // Check if user already exists (PATCH requires an existing user)
    if(dataStore->getUser(userId) == nullptr) {
        return Response(404, "Not Found");
    }
    // Call the base class logic to actually update the user and products
    AddCommand::execute(req);

    // Output success message
    return Response(204, "No Content");
}
const std::string PatchCommand::getDesc() {
    return "PATCH, arguments: [userid] [productid1] [productid2] …";
}