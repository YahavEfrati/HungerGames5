#ifndef DATASTORE_H
#define DATASTORE_H
#include <string>
#include <map>
#include <set>
#include <memory>
#include "../models/User.h"
#include "../models/Product.h"
 
/**
 * @class DataStore
 * @brief Manages users and their products in the system.
 * * This class handles saving new users and finding existing ones 
 * by their ID or by the products they own.
 */
class DataStore {
private:
    std::map<std::string, std::shared_ptr<User>> users; // Map of userId to User
    std::map<std::string, std::shared_ptr<Product>> products; // Map of productId to Product

    /**
     * @brief Internal helper to update a user's product list.
     * Ensures products are added correctly without duplicates.
     */
    void syncProducts(const std::set<std::string>& productIds);
    
public:

    /**
     * @brief Adds a new user or updates products for an existing user.
     * * If the user is new: Creates the user and associates all provided products.
     * If the user exists: Checks which products they don't have yet and adds them.
     * * @param userId The unique identifier for the user.
     * @param productIds A set of products to associate with the user.
     * @return std::set<std::string> A set containing only the new products that were added.
     */
    std::set<std::string> add(const std::string& userId, const std::set<std::string>& productIds = {});
    
    /**
     * @brief Finds a user by their ID.
     * * @return A pointer to the user if found, or nullptr if they don't exist.
     */
    std::shared_ptr<User> getUser(const std::string& userId) const;

    /**
     * @brief Gets a list of all users who have a specific product.
     * * @param productId The ID of the product to search for.
     * @return A set of users that own this product.
     */
    std::set<std::shared_ptr<User>> getUsersByProduct(const std::string& productId) const;

    /**
     * @brief Get a map of all users.
     * @return A map of all users.
     */
    const std::map<std::string, std::shared_ptr<User>>& getUsers() const;
};

#endif