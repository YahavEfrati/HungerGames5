#include "User.h"


User::User(const std::string& id, const std::set<std::string>& products) : userId(id), products(products) {}


bool User::hasProduct(const std::string& productId) const {
    return products.find(productId) != products.end();
}

void User::addProducts(const std::set<std::string>& otherProducts) {
    products.insert(otherProducts.begin(), otherProducts.end());
}

// Counts how many products exist in both sets.
int User::countSharedProducts(const std::shared_ptr<User> otherUser) const {
    if(otherUser == nullptr) {
        return 0;
    }
    int count = 0;
    for (const auto& product : otherUser->getProducts()) {
        if (products.find(product) != products.end()) {
            count++;
        }
    }
    return count;
}

void User::removeProduct(const std::string& productId){
    products.erase(productId);
}

// Remove a products from the user's product list
const std::set<std::string>& User::getProducts() const {
    return products;
}

const std::string& User::getUserId() const {
    return userId;
}