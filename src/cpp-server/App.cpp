#include "App.h"
#include "tools/Request.h"
#include "tools/Response.h"
#include "tools/StringUtils.h"
#include <algorithm>
#include <cctype>

// **CHANGED: Added output to constructor initialization list**
App::App(const std::shared_ptr<IInput>& input, const std::shared_ptr<IOutput>& output, const std::map<std::string, std::shared_ptr<ICommand>>& commands)
         : input(input), output(output), commands(commands) {}

void App::run() {
    std::string userInput;

    //Main loop, will continue until the input is closed (EOF or error)
    //getInput will return flase if the input is closed, otherwise it will
    //return true and put the input in userInput via reference.
    while(input->getInput(userInput)) {

        // std::vector<std::string> inputVector = StringUtils::stringToVector(userInput);
                
        Request req(userInput);
        
        std::string commandName = req.getMethod();


        /* Convert the command name to lowercase to make the command case-insensitive.
         * Using a lambda with a cast to unsigned char prevents C++ compiler 
         * overload resolution issues and undefined behavior.
         */
        std::transform(commandName.begin(), commandName.end(), commandName.begin(), 
            [](unsigned char c){ return std::tolower(c); });
        
        //Checks if the command exist on the map (Otherwise, in CPP, map will create a nullptr
        //to non-exsisting value)
        auto command = commands.find(commandName);
        
        if(command != commands.end()){
            //Command exist, execute using Request and capture Response
            Response res = command->second->execute(req);
            
            output->giveOutput(res.serialize()); 
        } else {
            Response errRes(400, "Bad Request");
            output->giveOutput(errRes.serialize());
        }
    }
}

