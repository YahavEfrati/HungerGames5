#include <gtest/gtest.h>
#include "../src/cpp-server/commands/AddCommand.h"
#include "../src/cpp-server/database/DataStore.h"
#include "../src/cpp-server/tools/Request.h" 
#include "../src/cpp-server/tools/Response.h" 
#include <memory>
/*
 * FakeDatabase is a mock implementation of the IDatabase interface used for testing purposes.
 */
class FakeDatabase : public IDatabase {
public:
    bool wasWriteCalled = false;

    //Simulate writing to the database by setting a flag when the write method is called
    void write(const std::string& data) override {
        wasWriteCalled = true; 
    }
    void read(std::shared_ptr<DataStore> store) override {
        // No need to read anything here.
    }
    void overwrite(const std::string& data) override {
        // No need to read anything here.
    }
};

TEST(AddCommandTest, ExecuteWritesToDatabase) {
     // Create an instance of the fake database
    std::shared_ptr<FakeDatabase> fakeDb = std::make_shared<FakeDatabase>();
    // Create an empty DataStore
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    // Create an instance of AddCommand with the fake database
    AddCommand addCommand(fakeDb, dataStore); 
    // Execute the command with the sample arguments
    addCommand.execute(Request("add 100 344"));
    // Verify that the write method was called 
    EXPECT_TRUE(fakeDb->wasWriteCalled); 
}

TEST(AddCommandTest, ExecuteWithTheDataStore) {
     // Create an instance of the fake database
    std::shared_ptr<FakeDatabase> fakeDb = std::make_shared<FakeDatabase>();
    // Create an empty DataStore
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    // Create an instance of AddCommand with the fake database and system map
    AddCommand addCommand(fakeDb, dataStore); 
    // Execute the command with sample arguments
    addCommand.execute(Request("add 100 344"));
    // The Command shoud add to the user "100" the value "344" in the DataStore.
    ASSERT_NE(dataStore->getUser("100"), nullptr);
    EXPECT_EQ(dataStore->getUser("100")->getProducts().size(), 1);
    EXPECT_TRUE(dataStore->getUser("100")->hasProduct("344"));
}

TEST(AddCommandTest, ExecuteWithMultipleProducts){
   // Create an instance of the fake database
    std::shared_ptr<FakeDatabase> fakeDb = std::make_shared<FakeDatabase>();
    // Create an empty DataStore
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    // Create an instance of AddCommand with the fake database and DataStore
    AddCommand addCommand(fakeDb, dataStore); 
    // Execute with mulitple products
    addCommand.execute(Request("add 100 344 345 346"));
    // The Command should add to the user "100" those 3 products
    ASSERT_NE(dataStore->getUser("100"), nullptr);
    EXPECT_EQ(dataStore->getUser("100")->getProducts().size(), 3);
    EXPECT_TRUE(dataStore->getUser("100")->hasProduct("344"));
    EXPECT_TRUE(dataStore->getUser("100")->hasProduct("345"));
    EXPECT_TRUE(dataStore->getUser("100")->hasProduct("346"));
    EXPECT_TRUE(fakeDb->wasWriteCalled);
}

TEST(AddCommandTest, ExecuteWithDuplicates){
// Create an instance of the fake database
    std::shared_ptr<FakeDatabase> fakeDb = std::make_shared<FakeDatabase>();
    // Create an empty DataStore
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    // Create an instance of AddCommand with the fake database and DataStore
    AddCommand addCommand(fakeDb, dataStore); 
    // Execute with mulitple products
    addCommand.execute(Request("add 100 344 344 344"));
    // The Command should add to the user "100" only one product "344"
    ASSERT_NE(dataStore->getUser("100"), nullptr);
    EXPECT_EQ(dataStore->getUser("100")->getProducts().size(), 1);
    EXPECT_TRUE(dataStore->getUser("100")->hasProduct("344"));

    addCommand.execute(Request("add 100 344 345"));
    // the Command should not add product "344" again but should add product "345"
    EXPECT_EQ(dataStore->getUser("100")->getProducts().size(), 2);
    EXPECT_TRUE(dataStore->getUser("100")->hasProduct("345"));
    
    // Reset the flag to check if the write method is called again
    fakeDb->wasWriteCalled = false;
    addCommand.execute(Request("add 100 344"));
    // the Command should not add product "344" again
    EXPECT_FALSE(fakeDb->wasWriteCalled);
}

TEST(AddCommandTest, WrongArguments) {
    // Create an instance of the fake database
    std::shared_ptr<FakeDatabase> fakeDb = std::make_shared<FakeDatabase>();
    // Create an empty DataStore
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    // Create an instance of AddCommand with the fake database and DataStore
    AddCommand addCommand(fakeDb, dataStore); 
    // Execute the command only user id without product (should not do anything)
    addCommand.execute(Request("add 100"));
    // The Command should not add user 100 and should not call the write method of the database
    EXPECT_FALSE(fakeDb->wasWriteCalled);
    EXPECT_EQ(dataStore->getUser("100"), nullptr);     
}