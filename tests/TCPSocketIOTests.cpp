#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string>


#include "../src/cpp-server/io/TCPSocketIO.h" 

class TCPSocketIOTest : public ::testing::Test {
protected:
    int sv[2];

    void SetUp() override {
        // creating a pair of connected sockets for testing
        ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);
    }

    void TearDown() override {
        // closing both sockets after each test
        close(sv[0]);
        close(sv[1]);
    }
};


TEST_F(TCPSocketIOTest, GetInputReadsCorrectlyUntilNewLine) {
    // Creating an instance of TCPSocketIO with the server side of the socket pair
    TCPSocketIO serverIO(sv[0]);

    // Simulating a client sending a command followed by a newline character
    std::string clientMessage = "GET 100 123\n";
    send(sv[1], clientMessage.c_str(), clientMessage.length(), 0);

    // The server should read the message until the newline character and return it
    std::string receivedCmd;
    bool status = serverIO.getInput(receivedCmd);

    EXPECT_TRUE(status);
    EXPECT_EQ(receivedCmd, "GET 100 123");
}


TEST_F(TCPSocketIOTest, GiveOutputSendsDataCorrectly) {
    TCPSocketIO serverIO(sv[0]);

    // The server sends a response
    std::string serverResponse = "200 Ok\n\n101 102";
    serverIO.giveOutput(serverResponse);

    // The client should receive the exact response sent by the server
    char buffer[1024] = {0};
    int bytesRead = recv(sv[1], buffer, sizeof(buffer), MSG_DONTWAIT);

    ASSERT_GT(bytesRead, 0);
    EXPECT_EQ(std::string(buffer, bytesRead), serverResponse + "\n");
}


TEST_F(TCPSocketIOTest, GetInputReturnsFalseOnClientDisconnect) {
    TCPSocketIO serverIO(sv[0]);

    // Simulating a client disconnect by closing the client socket
    close(sv[1]);

    std::string receivedCmd;
    // The server should detect the disconnect and return false
    bool status = serverIO.getInput(receivedCmd);
    
    EXPECT_FALSE(status);
}