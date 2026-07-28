#include <gtest/gtest.h>
#include <stdexcept>
#include "../src/cpp-server/App.h"
#include "../src/cpp-server/tools/Request.h" 
#include "../src/cpp-server/tools/Response.h" 
#include "../src/cpp-server/io/IOutput.h" 

// Create fake inputs and commands for testing

class fakeValidInput : public IInput {
private:
    int callCount = 0;
public:
    bool getInput(std::string& input) override {
        if (callCount++ == 0) {
            input = "add 1 1";
            return true;
        }
        throw std::runtime_error("End of mock input");
    }
};

class FakeOutput : public IOutput {
    public:
        std::string savedOutput = "";

        void giveOutput(const std::string& text) override{
            savedOutput += text + "\n";
        }
};

class fakeInvalidInput : public IInput {
private:
    int callCount = 0;
public:
    bool getInput(std::string& input) override {
        if (callCount++ == 0) {
            input = "blabla 1 1";
            return true;
        }
        throw std::runtime_error("End of mock input");
    }
};

class fakeEmptyInput : public IInput {
private:
    int callCount = 0;
public:
    bool getInput(std::string& input) override {
        if (callCount++ == 0) {
            input = "  ";
            return true;
        }
        throw std::runtime_error("End of mock input");
    }
};

class fakeOutput : public IOutput {
public:
    std::string savedOutput = "";
    void giveOutput(const std::string& text) override {
        savedOutput += text;
    }
};

class fakeAddCommands : public ICommand {
public:
    bool wasCalled = false;
    std::vector<std::string> argsReceived;
    Response execute(const Request& req) override { 
        wasCalled = true;
        argsReceived = req.getArgs(); 
        return Response(200, "OK"); 
    }
    const std::string getDesc() override {
        return "fake add command";
    }
};

class fakeHelpCommands : public ICommand {
public:
    bool wasCalled = false;
    Response execute(const Request& req) override { 
        wasCalled = true;
        return Response(200, "OK"); 
    }
    const std::string getDesc() override {
        return "fake help command";
    }
};

class fakeRecommendCommands : public ICommand {
public:
    bool wasCalled = false;
    Response execute(const Request& req) override { 
        wasCalled = true;
        return Response(200, "OK"); 
    }
    const std::string getDesc() override {
        return "fake recommend command";
    }
};

TEST(AppTest, RunWithValidInput) {
    // Create a fake input and output
    std::shared_ptr<IInput> input = std::make_shared<fakeValidInput>();
    std::shared_ptr<IOutput> output = std::make_shared<fakeOutput>();
    
    std::map<std::string, std::shared_ptr<ICommand>> commands;
    auto fakeAdd = std::make_shared<fakeAddCommands>();
    commands["add"] = fakeAdd;

    // Create an instance of the App
    App app(input, output, commands);
    
    // Run the app inside a try-catch to handle the deliberate exception that stops the infinite loop
    try {
        app.run();
    } catch (const std::runtime_error& e) {
        // To break the infinite loop.
    }

    // Should have called the add command since the input is valid
    EXPECT_TRUE(fakeAdd->wasCalled); 
    auto expectedArgs = std::vector<std::string>{"1", "1"};
    EXPECT_EQ(fakeAdd->argsReceived, expectedArgs);
}

TEST(AppTest, RunWithInvalidInput) {
    std::shared_ptr<IInput> input = std::make_shared<fakeInvalidInput>();
    std::shared_ptr<IOutput> output = std::make_shared<fakeOutput>();
    std::map<std::string, std::shared_ptr<ICommand>> commands;
    
    auto fakeAdd = std::make_shared<fakeAddCommands>();
    auto fakeHelp = std::make_shared<fakeHelpCommands>();
    auto fakeRecommend = std::make_shared<fakeRecommendCommands>();

    commands["add"] = fakeAdd;
    commands["help"] = fakeHelp;
    commands["recommend"] = fakeRecommend;


    // Run with non-existent command
    App app(input, output, commands);
    try {
        app.run();
    } catch (const std::runtime_error& e) {}
    
    // None of the commands should be called since the input is invalid
    EXPECT_FALSE(fakeAdd->wasCalled); 
    EXPECT_FALSE(fakeHelp->wasCalled); 
    EXPECT_FALSE(fakeRecommend->wasCalled); 
}

TEST(AppTest, RunWithEmptyCommands) {
    std::shared_ptr<IInput> input = std::make_shared<fakeEmptyInput>();
    std::shared_ptr<IOutput> output = std::make_shared<fakeOutput>();
    std::map<std::string, std::shared_ptr<ICommand>> commands;
    
    auto fakeAdd = std::make_shared<fakeAddCommands>();
    auto fakeHelp = std::make_shared<fakeHelpCommands>();
    auto fakeRecommend = std::make_shared<fakeRecommendCommands>();

    commands["add"] = fakeAdd;
    commands["help"] = fakeHelp;
    commands["recommend"] = fakeRecommend;

    // Run with empty input
    App app(input, output, commands);
    try {
        app.run();
    } catch (const std::runtime_error& e) {}

    // None of the commands should be called since the input is empty
    EXPECT_FALSE(fakeAdd->wasCalled); 
    EXPECT_FALSE(fakeHelp->wasCalled); 
    EXPECT_FALSE(fakeRecommend->wasCalled); 
}