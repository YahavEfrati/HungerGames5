#include <gtest/gtest.h>
#include "../src/cpp-server/tools/StringUtils.h"

TEST(StringUtilsTest, StringToVector) {
    std::string input = "command arg1 arg2 arg3";
    std::vector<std::string> expected = {"command", "arg1", "arg2", "arg3"};
    std::vector<std::string> result = StringUtils::stringToVector(input);
    EXPECT_EQ(result, expected);
}

TEST(StringUtilsTest, StringWithExtraSpaces) {
    std::string input1 = "  command   arg1  arg2   arg3  ";
    std::string input2 = "command      arg4      arg5      arg6";
    std::string input3 = "command";
    for(int i = 0; i < 1000; i++) {
        //ONLY SPAECES - should be ignored.
        input3.append("          ");
    }
    input3.append("arg7");
    
    std::vector<std::string> expected = {"command", "arg1", "arg2", "arg3"};
    std::vector<std::string> result1 = StringUtils::stringToVector(input1);
    EXPECT_EQ(result1, expected);

    std::vector<std::string> expected2 = {"command", "arg4", "arg5", "arg6"};
    std::vector<std::string> result2 = StringUtils::stringToVector(input2);
    EXPECT_EQ(result2, expected2);

    std::vector<std::string> expected3 = {"command", "arg7"};
    std::vector<std::string> result3 = StringUtils::stringToVector(input3);
    EXPECT_EQ(result3, expected3);
}

TEST(StringUtilsTest, EmptyString) {
    std::string input = "   ";
    std::vector<std::string> expected = {};
    std::vector<std::string> result = StringUtils::stringToVector(input);
    EXPECT_EQ(result, expected);
}

TEST(StringUtilsTest, OnlySpaceCharIsDelimiter) {
    std::string input = "command     \targ1    \narg2 \rarg3";
    std::vector<std::string> expected = {"command", "\targ1", "\narg2", "\rarg3"};
    std::vector<std::string> result = StringUtils::stringToVector(input);
    // In the demmands, only the ' ' character need to be trimmed.
    // All other white spaces should be treated as part of the argument, and not trimmed.
    EXPECT_EQ(result, expected);
}

TEST(StringUtilsTest, VectorToString) {
    std::vector<std::string> input = {"user1", "arg1", "arg2", "arg3"};
    std::string expected = "user1 arg1 arg2 arg3";
    std::string result = StringUtils::vectorToString(input);
    EXPECT_EQ(result, expected);
}

