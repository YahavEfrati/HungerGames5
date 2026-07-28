    #include "HelpCommand.h"

    //Constructs a HelpCommand.
    HelpCommand::HelpCommand(
        std::shared_ptr<std::map<std::string, std::shared_ptr<ICommand>>> cmds
    ) : commands(cmds) {}

    //Executes the help command to display the menu.
    Response HelpCommand::execute(const Request& req) {
        // Get the arguments from the request (if any)
        const std::vector<std::string>& args = req.getArgs();
        if (!args.empty()){
            return Response(400, "Bad Request");
        }
        std::string final_output = "";
        // Lock the weak_ptr to get a shared_ptr to the commands map
        auto cmdsMap = commands.lock();
        std::string output = "";
        for (const auto& pair : *cmdsMap) {
            //Skip the "help" command to print it last (map sorts alphabetically)
            if(pair.first == "help") {
                continue;
            }
            std::shared_ptr<ICommand> cmd = pair.second;
            output += cmd->getDesc() + "\n";
        }
        //Print "help" at the bottom of the list
        output += this->getDesc();
        return Response(200, "OK", output, true);
    }

    //Returns the description for the help command.
    const std::string HelpCommand::getDesc(){
        return "help";
    }
