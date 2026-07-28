#include <memory>
#include <map>
#include "TCPServer.h"


int main(int argc, char* argv[]) {
	int port;
    if (argc == 2) {
		// try to parse the port from the command line arguments, if it fails, we will exit.
        try {
            port = std::stoi(argv[1]); 
        } catch (const std::exception& e) {
            return -1;
        }
    } else{
		// If no port is provided, or we got more than 1 argument, we will exit.
		return -1;
	}
    TCPServer server(port);
	server.run();
    return 0;
}
