#include <gtest/gtest.h>
#include "../src/cpp-server/commands/HelpCommand.h"
#include "../src/cpp-server/tools/Request.h"
#include "../src/cpp-server/tools/Response.h"
#include <memory>
#include <string>
#include <vector>
#include <map>

/**
 * Dummy commands to test if HelpCommand correctly iterates the map.
 */
class FakeCommand1 : public ICommand {
    public:
    Response execute(const Request& req) override { return Response(200, "OK"); };
    const std::string getDesc() override{
        return "add [userid] [productid1] [productid2] ...";
    }
};
class FakeCommand2 : public ICommand {
    public:
    Response execute(const Request& req) override { return Response(200, "OK"); };
    const std::string getDesc() override{
        return "recommend [userid] [productid]";
    }
};

/**
 * Test Fixture for HelpCommand.
 * Prepares the environment once, and runs before every individual test.
 */
class HelpCommandTest : public ::testing::Test {
protected:
    std::shared_ptr<std::map<std::string, std::shared_ptr<ICommand>>> cmdMap;
    std::shared_ptr<HelpCommand> helpCmd;

    // This function runs automaticaly before every TEST_F
    void SetUp() override {
        cmdMap = std::make_shared<std::map<std::string, std::shared_ptr<ICommand>>>();
        
        // Injecting fake commands into the shared map
        auto cmd1 = std::make_shared<FakeCommand1>();
        auto cmd2 = std::make_shared<FakeCommand2>();
        (*cmdMap)["add"] = cmd1;
        (*cmdMap)["recommend"] = cmd2;

        helpCmd = std::make_shared<HelpCommand>(cmdMap);
        (*cmdMap)["help"] = helpCmd; // Adding help to the map
    }
};


TEST_F(HelpCommandTest, PrintCorrectMenu){
    Response res = helpCmd->execute(Request("help"));

    std::string expectedOutput = 
    "add [userid] [productid1] [productid2] ...\n"
     "recommend [userid] [productid]\n"
     "help";

    EXPECT_EQ(res.getBody(), expectedOutput);
}

TEST_F(HelpCommandTest, IgnoreArguments) {
    // Sends illegal arguments.
    Response res = helpCmd->execute(Request("help 123")); // **CHANGED: Passed Request and captured Response**

    EXPECT_EQ(res.getBody(), "");

}