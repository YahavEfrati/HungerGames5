cmake_minimum_required(VERSION 3.10)

project(HungerGames)

set(CMAKE_CXX_STANDARD 11)

include_directories(.)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.11.0.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

add_library(AppCore
    commands/AddCommand.cpp
    commands/RecommendCommand.cpp
    commands/HelpCommand.cpp
    commands/DeleteCommand.cpp
    commands/GetCommand.cpp
    database/DataStore.cpp
    models/User.cpp
    models/Product.cpp
    tools/StringUtils.cpp
    tools/Response.cpp
    tools/Request.cpp
    App.cpp
    database/FileDatabase.cpp
    io/ConsoleInput.cpp
    io/ConsoleOutput.cpp
    io/TCPSocketIO.cpp
    TCPServer.cpp
    commands/CommandFactory.cpp
    commands/PostCommand.cpp
    commands/PatchCommand.cpp
)

add_executable(HungerGamesApp
    main.cpp
)

target_link_libraries(HungerGamesApp AppCore)
target_include_directories(HungerGamesApp PRIVATE .)

add_executable(runTests
    ../../tests/HelpCommandTests.cpp
    ../../tests/AddCommandTest.cpp
    ../../tests/RecommendCommandTest.cpp
    ../../tests/DataStoreTests.cpp
    ../../tests/StringUtilsTests.cpp
    ../../tests/AppTest.cpp
    ../../tests/FileDatabaseTest.cpp
    ../../tests/PostCommandTest.cpp
    ../../tests/PatchCommandTest.cpp
    ../../tests/DeleteCommandTest.cpp
    ../../tests/TCPSocketIOTests.cpp
    ../../tests/TCPServerTests.cpp
    ../../tests/GetCommandTests.cpp
)

target_link_libraries(runTests gtest_main AppCore)
target_include_directories(runTests PRIVATE .)