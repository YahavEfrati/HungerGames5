#include <gtest/gtest.h>
#include <fstream>
#include <memory>
#include <string>
#include <cstdio>
#include "../src/cpp-server/database/FileDatabase.h"
#include "../src/cpp-server/database/DataStore.h"

// Test Fixture for FileDatabase. 
// Provides a clean, isolated environment for testing file I/O operations.
class FileDatabaseTest : public ::testing::Test {
protected:
    const std::string testFileName = "test_database.txt";

    // SetUp runs before EVERY test.
    // It ensures we start with a clean state by deleting any leftover files.
    void SetUp() override {
        std::remove(testFileName.c_str());
    }

    // TearDown runs after EVERY test (even if the test fails/crashes).
    // It ensures we don't leave "garbage" files on the hard drive.
    void TearDown() override {
        std::remove(testFileName.c_str());
    }
};
TEST_F(FileDatabaseTest, WriteCreatesCorrectTextInFile) {
    FileDatabase db(testFileName);
    
    db.write("1 100 101");
    db.write("2 200");

    std::ifstream inFile(testFileName);

    //Stop the test immediately if the file wasn't created
    ASSERT_TRUE(inFile.is_open()) << "The file was not created!";

    std::string line1, line2;
    std::getline(inFile, line1);
    std::getline(inFile, line2);

    // Verify the format matches exactly what we expect
    EXPECT_EQ(line1, "1 100 101");
    EXPECT_EQ(line2, "2 200");
}

TEST_F(FileDatabaseTest, ReadParsesFileAndBuildsDataStore) {
    std::ofstream outFile(testFileName);
    outFile << "99 500 501\n";
    outFile << "100 600\n";
    outFile << "101 700 701 702\n";
    outFile.close();

    FileDatabase db(testFileName);
    auto store = std::make_shared<DataStore>();

    // Trigger the read function, passing the empty store to be populated
    db.read(store);

    // Verify that the DataStore was successfully built from the text file
    auto user99 = store->getUser("99");
    ASSERT_NE(user99, nullptr) << "User 99 was not created in DataStore!";
    
    // Verify the specific products were successfully parsed and attached
    EXPECT_TRUE(user99->hasProduct("500"));
    EXPECT_TRUE(user99->hasProduct("501"));


    auto user100 = store->getUser("100");
    ASSERT_NE(user100, nullptr) << "User 100 was not created in DataStore!";
    EXPECT_TRUE(user100->hasProduct("600"));

    auto user101 = store->getUser("101");
    ASSERT_NE(user101, nullptr) << "User 101 was not created in DataStore!";
    EXPECT_TRUE(user101->hasProduct("700"));
    EXPECT_TRUE(user101->hasProduct("701"));
    EXPECT_TRUE(user101->hasProduct("702"));
}

TEST_F(FileDatabaseTest, overwriteTheData) {
    FileDatabase db(testFileName);

    db.write("1 100 101");
    db.write("2 200");

    std::string newData = "1 100\n2 200\n";

    // Overwrite with updated data.
    db.overwrite(newData);

    std::ifstream inFile(testFileName);
    ASSERT_TRUE(inFile.is_open());

    // Reading all file content
    std::string content((std::istreambuf_iterator<char>(inFile)), 
                         std::istreambuf_iterator<char>());
    inFile.close();

    EXPECT_EQ(content, newData) << "Data is not the same";
}