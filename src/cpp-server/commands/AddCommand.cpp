#include "AddCommand.h"
#include "../tools/StringUtils.h"
#include "../tools/Response.h"
#include "../tools/Request.h"

AddCommand::AddCommand(std::shared_ptr<IDatabase> db, std::shared_ptr<DataStore> dataStore) 
    : database(db), dataStore(dataStore) {}

Response AddCommand::execute(const Request& req) {
	// get the arguments from the request
    const std::vector<std::string>& args = req.getArgs();
	
    // Stop if there is no user ID or no products
    if(args.size() < 2)
			return Response(400, "Bad Request");

	std::string userId = args[0];
	// Put all products into a set to remove duplicates from the input
	std::set<std::string> allProducts(args.begin() + 1, args.end());
	// Add to DataStore and get back ONLY the newly added products
	std::set<std::string> newProducts = dataStore->add(userId, allProducts);
	
	// If all products already existed, we dont need to write it into the DB
	if(newProducts.empty())
		return Response(200, "OK");
	
	// Write the new Products into the DB.
	std::vector<std::string> newProductsVector(newProducts.begin(), newProducts.end());
	database->write(userId+ ' ' + StringUtils::vectorToString(newProductsVector));
	return Response(200, "OK");
}

const std::string AddCommand::getDesc() {
   return "add [userid] [productid1] [productid2] …";
}