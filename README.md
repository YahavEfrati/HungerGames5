# Food Delivery Full-Stack Platform - Assignment 5 - HungerGames

## Project Description
This project was developed as part of the Advanced Programming course. In this stage (Assignment 4), we expanded our backend architecture into a complete, full-stack web application inspired by real-world delivery platforms (like Wolt). 

The system now features a dynamic React frontend that communicates seamlessly with our previously built backend, presenting real, database-driven data to the users.

The system is composed of three main components:
1. **The Frontend Application (React):** A dynamic Single Page Application (SPA) providing a modern user interface, handling client-side routing, state management, and real-time validations.
2. **The Main Web API (Node.js):** A RESTful web server built on the MVC pattern. It handles business logic, database management, strict server-side validation, and JWT-based authentication.
3. **The View History Engine (C++):** A background server communicating via TCP, dedicated exclusively to tracking and managing the product viewing history of authenticated users.

## Frontend Architecture & Features
The client-side application is built using **React** (HTML, CSS, JS) and utilizes modern hooks (`useState`, `useRef`, `useEffect`) and `react-router-dom` for seamless navigation without page reloads.

Key features include:
* **Authentication & Security (JWT):** A complete login and registration flow. Upon successful login, the server issues a JSON Web Token (JWT) which the React app securely stores and attaches to subsequent authorized requests.
* **Strict Validations:** Both the registration and login forms feature strict client-side validations (e.g., passwords must be at least 8 characters long, containing both letters and numbers). These validations are strictly mirrored on the Node.js backend.
* **Dynamic Content Display:** All entities (Restaurants, Products, Menus) are fetched dynamically from the Node.js API. No hard-coded mock data is used.
* **Global Search:** Users can search for specific items or restaurants directly from the top navigation bar.
* **Interactive UI & Dark Mode:** The application features a toggleable Light/Dark theme that globally updates the UI styling, mimicking a modern app experience.
* **Profile & Image Selection:** Users can select profile pictures during registration, which are then integrated into the UI (e.g., the top navigation bar).


## Team Workflow
Our team followed a rigorous Agile workflow throughout development to ensure high code quality, efficient collaboration, and clear tracking of progress:
JIRA Management: Work was systematically broken down into Epics, User Stories, and Tasks within structured sprints.
Status Tracking: We utilized advanced workflow statuses (e.g., In Progress, Code Review, Done) and explicitly marked task dependencies (e.g., "is blocked by").
Git & GitHub Practices: We adhered exclusively to the Feature Branch workflow, directly linking branch names to their corresponding JIRA Issue IDs.
Code Review & Merging: Code integration was performed solely through Pull Requests (PRs), requiring mandatory peer review and approval before merging.

## Build & Run
1. Server Environment (Docker Compose)
To simplify the deployment and execution of the backend systems, we have containerized the environments using Docker. You can launch the servers from a single terminal:
Ensure you have Docker and Docker Compose installed on your machine.
Open a single terminal and navigate to the project's root directory (where the docker-compose.yml file is located).
Run the following command to build the images and start all services simultaneously:

```bash
docker-compose up --build
```

2. Client Environment (Android Emulator)
To run and test the React Native mobile application, follow these steps:
Ensure you have Android Studio installed along with an Android Virtual Device (AVD) configured and running.
Ensure you have Node.js installed on your local machine.
Open a new terminal and navigate to the React Native app directory (e.g., cd src/wolt-app).
Start the Metro bundler and launch the app on your running Android emulator:

```bash
npx expo start
```
(Then press a to open the app on Android).
