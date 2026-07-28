#include <gtest/gtest.h>
#include "../src/cpp-server/commands/GetCommand.h"
#include "../src/cpp-server/database/DataStore.h"
#include "../src/cpp-server/tools/Request.h"
#include "../src/cpp-server/tools/Response.h"
#include <memory>
#include <string>

TEST(GetCommandTest, SuccessWithValidUser) {
    // Create setup dependencies
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();

    // Add user manually before execution so the GET command finds something
    dataStore->add("100", {"123", "456"});

    // Create an instance of GetCommand. 
    GetCommand getCommand(dataStore);

    // Execute the command to GET the user "100"
    Response res = getCommand.execute(Request("get 100 123"));

    // Verify the correct success output was returned
    EXPECT_EQ(res.getStatusCode(), 200);
}

TEST(GetCommandTest, InvalidArguments) {
    // Create setup dependencies
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    
    // Create an instance of GetCommand
    GetCommand getCommand(dataStore);

    // Execute with missing arguments (empty vector, no user ID)
    Response res = getCommand.execute(Request("get"));
    
    // Verify an appropriate error message was returned
    EXPECT_EQ(res.getStatusCode(), 400);
}

TEST(GetCommandTest, UserNotFound) {
    // Create an empty DataStore
    std::shared_ptr<DataStore> dataStore = std::make_shared<DataStore>();
    
    // Create an instance of GetCommand
    GetCommand getCommand(dataStore);

    // Execute with a user ID that does not exist in the DataStore
    Response res = getCommand.execute(Request("get 100 123"));
    
    // Verify an appropriate error message was returned
    EXPECT_EQ(res.getStatusCode(), 404);
}