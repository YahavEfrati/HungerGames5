#include <gtest/gtest.h>
#include "../src/cpp-server/database/DataStore.h"

TEST(DataStoreTest, AddNewUserWithProducts) {
    DataStore dataStore;
    std::string userId = "user1";
    std::set<std::string> products = {"productA", "productB"};
    dataStore.add(userId, products);
    std::shared_ptr<User> user = dataStore.getUser(userId);

    //Sould find the user after adding it - PREVENT CRASHING PRE-IMPLMENTATION
    ASSERT_NE(user, nullptr);

    //Should added 2 products to the user
    EXPECT_EQ(user->getProducts().size(), 2);
    //Sould have the correct products
    EXPECT_TRUE(user->hasProduct("productA"));
    EXPECT_TRUE(user->hasProduct("productB"));
    //Should have the correct userId
    EXPECT_EQ("user1", user->getUserId());
}

TEST(DataStoreTest, AddProductsToExistingUser) {
    DataStore dataStore;
    std::string userId = "user1";
    dataStore.add(userId, {"productA"});
    std::shared_ptr<User> user = dataStore.getUser(userId);
    dataStore.add(userId, {"productB"});
    std::shared_ptr<User> user2 = dataStore.getUser(userId);

    //Sould find the user after adding it - PREVENT CRASHING PRE-IMPLMENTATION
    ASSERT_NE(user, nullptr);

    //Sould have 2 products after adding the second product
    EXPECT_EQ(user->getProducts().size(), 2);
    //Sould have the new product
    EXPECT_TRUE(user->hasProduct("productB"));
    //Should be the same user object
    EXPECT_EQ(user, user2);
}

TEST(DataStoreTest, GetUsersByProduct) {
    DataStore dataStore;
    dataStore.add("user1", {"productA"});
    dataStore.add("user2", {"productA", "productB"});
    dataStore.add("user3", {"productB"});
    auto user1 = dataStore.getUser("user1");
    auto user2 = dataStore.getUser("user2");
    auto user3 = dataStore.getUser("user3");

    //Sould find the user after adding it - PREVENT CRASHING PRE-IMPLMENTATION
    ASSERT_NE(user1, nullptr);
    ASSERT_NE(user2, nullptr);
    ASSERT_NE(user3, nullptr);

    std::set<std::shared_ptr<User>> usersWithProductA = dataStore.getUsersByProduct("productA");
    //Sould find user1 and user2 with productA
    EXPECT_TRUE(usersWithProductA.find(user1) != usersWithProductA.end());
    EXPECT_TRUE(usersWithProductA.find(user2) != usersWithProductA.end());

    std::set<std::shared_ptr<User>> usersWithProductB = dataStore.getUsersByProduct("productB");
    //Sould find user2 and user3 with productB
    EXPECT_TRUE(usersWithProductB.find(user2) != usersWithProductB.end());
    EXPECT_TRUE(usersWithProductB.find(user3) != usersWithProductB.end());
    
    std::set<std::shared_ptr<User>> usersWithProductC = dataStore.getUsersByProduct("productC");
    //Sould not find any user with productC
    EXPECT_TRUE(usersWithProductC.empty());
}

TEST(DataStoreTest, CheckAddReturnValue) {
    DataStore dataStore;
    std::string userId = "user1";
    std::set<std::string> products = {"productA", "productB"};
    dataStore.add(userId, products);
    //Should return the new Products added to the user
    auto result1 = dataStore.add(userId, {"productC"});
    EXPECT_TRUE(result1.find("productC") != result1.end());
    //Should return empty set if no new product was added
    auto result2 = dataStore.add(userId, {"productA"});
    EXPECT_TRUE(result2.empty());
}

