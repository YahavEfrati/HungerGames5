#include <gtest/gtest.h>
#include "../src/cpp-server/commands/PostCommand.h"
#include "../src/cpp-server/database/DataStore.h"
#include "../src/cpp-server/tools/Request.h"
#include "../src/cpp-server/tools/Response.h"
#include <memory>
#include <string>

/*
 * FakeDatabase is a mock implementation of the IDatabase interface used for testing purposes.
 */
class FakeDatabase : public IDatabase {
public:
    bool wasWriteCalled = false;
    
    // Simulate writing to the database by setting a flag when the write method is called
    void write(const std::string& data) override {
        wasWriteCalled = true; 
    }
    
    void read(std::shared_ptr<DataStore> store) override {
        // No need to read anything here.
    }
    void overwrite(const std::string& data) override {
        // No need to overwrite anything in these tests.
    }
};

TEST(PostCommandTest, NewUserTest) {
    // Create an instance of the fake database
    std::shared_ptr<FakeDatabase> fakeDb = std::make_shared<FakeDatabase>();
    
    // Create an empty DataStore
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    
    // Create an instance of PostCommand with the fake database, DataStore
    PostCommand postCommand(fakeDb, dataStore);

    // Execute the command to create a NEW user "100" with product "344"
    Response res = postCommand.execute(Request("post 100 344"));

    // Verify the user was created successfully in the DataStore
    ASSERT_NE(dataStore->getUser("100"), nullptr);
    EXPECT_TRUE(dataStore->getUser("100")->hasProduct("344"));
    
    // Verify that the write method was called
    EXPECT_TRUE(fakeDb->wasWriteCalled); 
    
    // Verify the correct status code was returned
    EXPECT_EQ(res.getStatusCode(), 201);
}

TEST(PostCommandTest, UserAlreadyExists) {
    // Create an instance of the fake database
    std::shared_ptr<FakeDatabase> fakeDb = std::make_shared<FakeDatabase>();
    
    // Create an empty DataStore
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    
    // Add user manually before execution to simulate an existing user
    dataStore->add("100", {"123", "132", "444"});

    // Create an instance of PostCommand
    PostCommand postCommand(fakeDb, dataStore);

    // Execute the command trying to create the EXISTING user "100"
    Response res = postCommand.execute(Request("post 100 344"));
    
    // Verify that the write method was NOT called because the user already exists
    EXPECT_FALSE(fakeDb->wasWriteCalled);
    
    // Verify the correct error code was returned
    EXPECT_EQ(res.getStatusCode(), 404);
}

TEST(PostCommandTest, InvalidArguments) {
    // Create dependencies
    std::shared_ptr<FakeDatabase> fakeDb = std::make_shared<FakeDatabase>();
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    
    // Create the command
    PostCommand postCommand(fakeDb, dataStore);

    // Execute with missing arguments (only user ID, no product)
    Response res = postCommand.execute(Request("post 100"));
    
    // Verify that nothing was written to the database due to invalid args
    EXPECT_FALSE(fakeDb->wasWriteCalled);
    
    // Verify an appropriate error code was returned
    EXPECT_EQ(res.getStatusCode(), 400);
}