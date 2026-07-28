#ifndef ICOMMAND_H
#define ICOMMAND_H
#include <vector>
#include <string>
#include "../tools/Request.h"
#include "../tools/Response.h"

class ICommand {
    public:

    virtual Response execute(const Request& req) = 0;
    virtual const std::string getDesc() = 0;
    virtual ~ICommand() {};
};

#endif