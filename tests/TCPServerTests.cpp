#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string>

#include "../src/cpp-server/TCPServer.h"
#include "../src/cpp-server/database/DataStore.h"


class TestableTCPServer : public TCPServer {
public:
    explicit TestableTCPServer(int port) : TCPServer(port) {
        this->dataStore = std::make_shared<DataStore>(); 
    }
    using TCPServer::handleClient; 
};

TEST(TCPServerTest, HandleClientExecutesValidCommandWiring) {
    int testSv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, testSv), 0);
    TestableTCPServer server(5555);

    // Sending a valid command (HELP) to the server.
    std::string request = "help\n";
    send(testSv[1], request.c_str(), request.length(), 0);
    
    // Shutdown the writing will send 0 bytes to the server, simulating cleint closing the connection after sending the command.
    shutdown(testSv[1], SHUT_WR);

    server.handleClient(testSv[0]);

    char buffer[1024] = {0};
    int bytesRead = recv(testSv[1], buffer, sizeof(buffer), MSG_DONTWAIT);
    
    // We check that we received a response from the server so the creation of the response won't cause unexpected behavior in the server.
    ASSERT_GT(bytesRead, 0);

    std::string response(buffer, bytesRead);

    // We expect to receive some response from the server (the help message), it should not be empty or a bad request message.
    EXPECT_FALSE(response.empty());
    EXPECT_NE(response, "400 Bad Request\n");

    close(testSv[0]);
    close(testSv[1]);
}

TEST(TCPServerTest, HandleClientReturns400ForUnknownCommand) {
    int testSv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, testSv), 0);
    TestableTCPServer server(5555);

    // Sending an invalid command to the server.
    std::string request = "INVALID_COMMAND_BLABLA\n";
    send(testSv[1], request.c_str(), request.length(), 0);
    shutdown(testSv[1], SHUT_WR);

    server.handleClient(testSv[0]);

    char buffer[1024] = {0};
    int bytesRead = recv(testSv[1], buffer, sizeof(buffer), MSG_DONTWAIT);

    // We check that we received a response from the server so the creation of the response won't cause unexpected behavior in the server.
    ASSERT_GT(bytesRead, 0);
    EXPECT_EQ(std::string(buffer, bytesRead), "400 Bad Request\n");

    close(testSv[0]);
    close(testSv[1]);
}


TEST(TCPServerTest, ServerSurvivesClientDisconnect) {
    int testSv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, testSv), 0);
    TestableTCPServer server(5555);

    // Simulate client disconnecting immediately after connecting (no data sent).
    close(testSv[1]);

    // If the server can handle this gracefully without crashing, the test will pass.
    server.handleClient(testSv[0]);

    SUCCEED(); 
}