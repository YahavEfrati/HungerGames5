#ifndef USER_H
#define USER_H

#include <string>
#include <set>
#include <memory>
#include "Product.h"

/**
 * @brief Represents a user in the system.
 * Stores the user's ID and a set of products they own.
 */
class User {
    
private:
    std::string userId; 
    std::set<std::string> products;

public:
/**
     * @brief Constructs a User object.
     * @param id The unique user ID.
     * @param products Initial set of products (optional).
     */
    User(const std::string& id, const std::set<std::string>& products = {} );

    /**
     * @brief Checks if the user owns a specific product.
     * @param productId The product to check.
     * @return true if the product exists, false otherwise.
     */
    bool hasProduct(const std::string& productId) const;

    /**
     * @brief Adds multiple products to the user.
     * @param products Set of product IDs to add.
     */
    void addProducts(const std::set<std::string>& otherProducts);

    /**
     * @brief Counts shared products with another set.
     * @param otherProducts Set of products to compare with.
     * @return Number of shared products.
     */
    int countSharedProducts(const std::shared_ptr<User> otherUser) const;

    /**
     * @brief Remove a specific product
     * @param productId The product we want to erase.
     */
    void removeProduct(const std::string& productId);

    const std::set<std::string>& getProducts() const;
    const std::string& getUserId() const;
};

#endif