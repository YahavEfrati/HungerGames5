#include "RecommendCommand.h"
#include "../tools/StringUtils.h"
#include <map>
#include <algorithm>
#include <cctype>

RecommendCommand::RecommendCommand(std::shared_ptr<DataStore> ds)
    : dataStore(ds) {}

Response RecommendCommand::execute(const Request& req) {
    const std::vector<std::string>& args = req.getArgs();
    if (args.size() != 2) {
        return Response(400, "Bad Request");
    }

    std::string userId = args[0];
    std::string productId = args[1];

    std::shared_ptr<User> targetUser = dataStore->getUser(userId);
    // Check if user exists.
    if(targetUser == nullptr){
        return Response(404, "Not Found");
    }

    // Lambda function to check if the product ID is string or int.
    auto isNumeric = [](const std::string& str){
        for(char c : str){
            if(!std::isdigit(c)){
                return false;
            }
        }
        return true;
    };

    // Find all users with the relevant product.
    std::set<std::shared_ptr<User>> relevantUsers = dataStore->getUsersByProduct(productId);

    // Map to assess product relevance.
    std::map<std::string, int> productScores;
    
    // Calculate the weight for each product.
    for(const auto& neighbor : relevantUsers){
        // skip the current user.
        if(neighbor->getUserId() == userId){
            continue;
        }

        int weight = targetUser->countSharedProducts(neighbor);
        
        if(weight > 0){
            for(const auto& product: neighbor->getProducts()){
                //If the user has the product or if this is the same as the product ID we will skip.
                if(product != productId && !targetUser->hasProduct(product)){
                    productScores[product] += weight;
                }
            }
        }

    }

    // First we will sort by weight.
    std::vector<std::pair<std::string, int>> sortedProducts(productScores.begin(), productScores.end());

    // Second, we will sort by productId in case of draw.
    std::sort(sortedProducts.begin(), sortedProducts.end(), [&isNumeric](const std::pair<std:: string, int>& a, 
    const std::pair<std::string, int>& b) {
        if(a.second != b.second) {
            return a.second > b.second;
        }
        if(isNumeric(a.first) && isNumeric(b.first)){
            return std::stoi(a.first) < std::stoi(b.first);
        }
        return a.first < b.first;
    });

    // Prepare the recommandation list.
    std::vector<std::string> finalRecommandations;
    int count = 0;
    for (const auto& pair : sortedProducts){
        if(count >= 10) {
            break;
        }
        finalRecommandations.push_back(pair.first);
        count++;
    }
    
    // Prepare and return the final recommendation
    if (!finalRecommandations.empty()){
        std::string resaultString = StringUtils::vectorToString(finalRecommandations);
        return Response(200, "OK", resaultString);
    } 

    //For empty list
    return Response(200, "OK","");
}

const std::string RecommendCommand::getDesc() {
    return "recommend [userid] [productid]";
}