#include "GetCommand.h"
#include "RecommendCommand.h"

// Pass the arguments up to the base class (RecommendCommand) constructor
GetCommand::GetCommand(std::shared_ptr<DataStore> ds) 
    : RecommendCommand(ds) {}


Response GetCommand::execute(const Request& req) {
    const std::vector<std::string>& args = req.getArgs();
    if(args.size() != 2) {
		return Response(400, "Bad Request");
    }
    if(!dataStore->getUser(args[0])) {
        return Response(404, "Not Found");
    }
    return Response(200, "Ok","\n" + RecommendCommand::execute(req).getBody());
}

const std::string GetCommand::getDesc() {
    return "GET, arguments: [userid] [productid]";
}

