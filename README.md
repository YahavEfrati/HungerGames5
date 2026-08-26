# Food Delivery Full-Stack Platform - Assignment 5 - HungerGames

Overview & Tech Stack
This project is a comprehensive delivery platform simulation, built with a robust, microservices-oriented architecture:
C++ Recommendation Engine: Implements Collaborative Filtering to suggest items based on Euclidean Distance user matching.
Node.js Backend: An Express-based RESTful API utilizing the MVC design pattern to manage users, restaurants, and products.
React Frontend: Handles the user interface, including the restaurant menu display and the checkout flow.
Inter-Service Communication: The Node.js server acts as a client to the C++ server via TCP Sockets for real-time recommendation processing.

Team Workflow
Our team followed a rigorous Agile workflow throughout development to ensure high code quality, efficient collaboration, and clear tracking of progress:
JIRA Management: Work was systematically broken down into Epics, User Stories, and Tasks within structured sprints.
Status Tracking: We utilized advanced workflow statuses (e.g., In Progress, Code Review, Done) and explicitly marked task dependencies (e.g., "is blocked by").
Git & GitHub Practices: We adhered exclusively to the Feature Branch workflow, directly linking branch names to their corresponding JIRA Issue IDs.
Code Review & Merging: Code integration was performed solely through Pull Requests (PRs), requiring mandatory peer review and approval before merging.

Build & Run
To simplify the deployment and execution of the entire system, we have containerized all environments using Docker. You can launch the complete system from a single terminal:
Ensure you have Docker and Docker Compose installed on your machine.
Open a single terminal and navigate to the project's root directory (where the docker-compose.yml file is located).
Run docker-compose up --build to build the images and start all services simultaneously.
