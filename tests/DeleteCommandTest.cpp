#include <gtest/gtest.h>
#include "../src/cpp-server/database/DataStore.h"
#include "../src/cpp-server/commands/DeleteCommand.h"
#include "../src/cpp-server/database/IDatabase.h"
#include "../src/cpp-server/tools/Request.h" 
#include "../src/cpp-server/tools/Response.h"
#include <memory>


// Create fake database
class FakeDataBaseDel : public IDatabase {
public:
    bool wasWriteCalled = false;
    bool wasOverwriteCalled = false;
    void write(const std::string& data) override {
        wasWriteCalled = true;
    }
    void read(std::shared_ptr<DataStore> store) override{}
    void overwrite(const std::string& data) override {
        wasOverwriteCalled = true;
    }
};

// TEST 1: Seccessful deletion returns 204 No Content and actually delete the product
TEST(DeleteCommandTest, SuccessReturns204AndRemovesProduct){
    auto fakedb = std::make_shared<FakeDataBaseDel>();
    auto datastore = std::make_shared<DataStore>();

    // Add user "1" with products "101", "102"
    datastore->add("1", {"101", "102"});

    // Delete product "101" from user "1"
    DeleteCommand cmd(fakedb, datastore);
    Response res = cmd.execute(Request("delete 1 101"));

    // Expectation 1: correct output
    EXPECT_EQ(res.getStatusCode(), 204);
    EXPECT_EQ(res.getStatusMessage(), "No Content");

    // Expectation 2: product got deleted
    auto user = datastore->getUser("1");
    ASSERT_NE(user, nullptr) << "user '1' was not created in the datastore";

    EXPECT_FALSE(user->hasProduct("101")) << "Product '101' sohuld have benn removed!";
    EXPECT_TRUE(user->hasProduct("102")) << "Product '102' should remain untouched!";
}

// Test 2: Trying to delete a product from a non-existent user returns 404 Not Found
TEST(DeleteCommandTest, UserNotFoundReturns404){
    auto fakeDb = std::make_shared<FakeDataBaseDel>();
    auto datastore = std::make_shared<DataStore>();

    // Try to delete from user "99" who does not exist
    DeleteCommand cmd(fakeDb, datastore);
    Response res = cmd.execute(Request("delete 999 101"));

    // Expect the output to be "404 Not Found"
    EXPECT_EQ(res.getStatusCode(), 404);
}

// Test 3: Trying to delete a non-existent product from a valid user returns 404 Not Found
TEST(DeleteCommandTest, ProductNotFoundReturns404){
    auto fakeDb = std::make_shared<FakeDataBaseDel>();
    auto datastore = std::make_shared<DataStore>();

    datastore->add("1", {"101"});

    DeleteCommand cmd(fakeDb, datastore);
    Response res = cmd.execute(Request("delete 1 999"));

    auto user = datastore->getUser("1");
    ASSERT_NE(user, nullptr) << "user '1' was not created in the datastore";

    // Expectation: The output should be exactly "404 Not Found"
    EXPECT_EQ(res.getStatusCode(), 404);
    EXPECT_TRUE(user->hasProduct("101")) << "Product '101' should remain untouched!";
}

// Test 4: Successful deletion of MULTIPLE products returns 204 No Content
TEST(DeleteCommandTest, DeleteMultipleProductsSuccessfully) {
    auto fakeDb = std::make_shared<FakeDataBaseDel>();
    auto datastore = std::make_shared<DataStore>();

    // Add user "1" with 4 products
    datastore->add("1", {"101", "102", "103", "104"});

    // Delete products "101" and "103" from user "1"
    DeleteCommand cmd(fakeDb, datastore);
    Response res = cmd.execute(Request("delete 1 101 103"));

    // Expectation 1: The output should be exactly "204 No Content"
    EXPECT_EQ(res.getStatusCode(), 204);

    // Expectation 2: The Datastore should reflect the changes correctly
    auto user = datastore->getUser("1");
    ASSERT_NE(user, nullptr);
    
    // These should be gone:
    EXPECT_FALSE(user->hasProduct("101")) << "Product '101' should have been deleted";
    EXPECT_FALSE(user->hasProduct("103")) << "Product '103' should have been deleted";
    
    // These should remain:
    EXPECT_TRUE(user->hasProduct("102")) << "Product '102' should remain untouched!";
    EXPECT_TRUE(user->hasProduct("104")) << "Product '104' should remain untouched!";

    // Making sure overwrite function been called.
    EXPECT_TRUE(fakeDb->wasOverwriteCalled) << "ERROR, overwrite function should've been called";
}

// Test 5: Deletion with less then 2 arguments
TEST(DeleteCommandTest, DeleteWithLessThen2Arguments) {
    auto fakeDb = std::make_shared<FakeDataBaseDel>();
    auto datastore = std::make_shared<DataStore>();

    DeleteCommand cmd(fakeDb, datastore);
    Response res1 = cmd.execute(Request("delete"));
    // Expect 400 Bad Request
    EXPECT_EQ(res1.getStatusCode(), 400);

    Response res2 = cmd.execute(Request("delete 100"));
    EXPECT_EQ(res2.getStatusCode(), 400);
}

// Test 6: Trying to delete the same product twice.
TEST(DeleteCommandTest, DuplicatedProductDletion){
    auto fakeDb = std::make_shared<FakeDataBaseDel>();
    auto datastore = std::make_shared<DataStore>();

    datastore->add("1", {"101"});

    DeleteCommand cmd(fakeDb, datastore);
    Response res = cmd.execute(Request("delete 1 101 101"));

    EXPECT_EQ(res.getStatusCode(), 404) << "same products cannot be deleted twice";
}