#include "DataStore.h"

std::set<std::string> DataStore::add(const std::string& userId, const std::set<std::string>& productIds) {
    syncProducts(productIds);

    //if user doesn't exist, create it -> insert into map -> return all the products (all of them new)
    auto it = users.find(userId);
    if (it == users.end()) {
        users[userId] = std::make_shared<User>(userId, productIds);
        return productIds;
    }
    
    //if user exists, create a set of all the new products -> add them to user -> return the new set
    std::set<std::string> newProducts;
    for (const auto& product: productIds) {
        if (!it->second->hasProduct(product)){
            newProducts.insert(product);
        }
    }
    it->second->addProducts(newProducts);
    return newProducts;
}

void DataStore::syncProducts(const std::set<std::string>& productIds) {
    for (const auto& productId: productIds) {
        if(products.find(productId) == products.end()) {
            products[productId] = std::make_shared<Product>(productId);
        }
    }
}

std::shared_ptr<User> DataStore::getUser(const std::string& userId) const {
    auto it = users.find(userId);
    if (it != users.end()){
        return it->second;
    }
    return nullptr;
}

std::set<std::shared_ptr<User>> DataStore::getUsersByProduct(const std::string& productId) const {
    std::set<std::shared_ptr<User>> usersWithProduct;
    for (const auto& pair : users) {
        if (pair.second->hasProduct(productId)){
            usersWithProduct.insert(pair.second);
        }
    }
    return usersWithProduct;
}

// Return map of all users.
const std::map<std::string, std::shared_ptr<User>>& DataStore::getUsers() const {
    return users;
}