#include <gtest/gtest.h>
#include "../src/cpp-server/commands/RecommendCommand.h"
#include "../src/cpp-server/commands/AddCommand.h"
#include "../src/cpp-server/database/IDatabase.h"
#include "../src/cpp-server/database/DataStore.h"
#include "../src/cpp-server/tools/Request.h"
#include "../src/cpp-server/tools/Response.h"
#include <memory>

class FakeDatabaseRec : public IDatabase {
public:
    void write(const std::string& data) override {}
    void read(std::shared_ptr<DataStore> store) override {}
    void overwrite(const std::string& data) override {}
};

TEST(RecommendCommandTest, InvalidArgumentsIgnore) {
    auto dataStore = std::make_shared<DataStore>(); 
    
    RecommendCommand cmd(dataStore);
    Response res = cmd.execute(Request("recommend 1"));
    
    EXPECT_EQ(res.getStatusCode(), 400);
}

TEST(RecommendCommandTest, AppendixExampleAlgorithm) {
    auto fakeDb = std::make_shared<FakeDatabaseRec>();
    auto dataStore = std::make_shared<DataStore>();
    
    AddCommand addCmd(fakeDb, dataStore);
    addCmd.execute(Request("add 1 100 101 102 103"));
    addCmd.execute(Request("add 2 101 102 104 105 106"));
    addCmd.execute(Request("add 3 100 104 105 107 108"));
    addCmd.execute(Request("add 4 101 105 106 107 109 110"));
    addCmd.execute(Request("add 5 100 102 103 105 108 111"));
    addCmd.execute(Request("add 6 100 103 104 110 111 112 113"));
    addCmd.execute(Request("add 7 102 105 106 107 108 109 110"));
    addCmd.execute(Request("add 8 101 104 105 106 109 111 114"));
    addCmd.execute(Request("add 9 100 103 105 107 112 113 115"));
    addCmd.execute(Request("add 10 100 102 105 106 107 109 110 116"));

    RecommendCommand recCmd(dataStore);
    Response res = recCmd.execute(Request("recommend 1 104"));
    
    EXPECT_EQ(res.getBody(), "105 106 111 110 112 113 107 108 109 114");
}