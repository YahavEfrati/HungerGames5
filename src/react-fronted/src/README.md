# Food Delivery REST API - Assignment 3

## Project Description
This project was developed as part of the Advanced Programming course. In this stage (Assignment 3), we upgraded our system into a modern web backend architecture. 

The system is composed of two main components:
1. **The Recommendation Engine (C++):** A dedicated background server that manages the users' product view history. It uses a collaborative filtering algorithm to analyze user preferences and generate personalized product recommendations via a TCP connection.
2. **The Main Web API (Node.js):** A RESTful web server that handles the main application logic, user requests, and communicates with the C++ engine for analytics.

## Architecture: MVC Design Pattern
The web server is built using the **Model-View-Controller (MVC)** architectural pattern to keep the code organized, scalable, and easy to maintain:
* **Models / Services:** Manage the core data structures, business logic, and communication with the database or external servers (like our C++ TCP server).
* **Controllers:** Handle the incoming HTTP requests, validate the input, call the appropriate service, and return the HTTP responses.
* **Views:** Since this is a REST API, our "views" are simply the standard JSON responses sent back to the client.

## Core Entities
Our API manages several key entities to support the food delivery platform:

* **Users:** Manages user profiles, including registration details, personal information, and user-specific data.
* **Auth (Tokens):** Responsible for system security. It handles user login and generates JWTs (JSON Web Tokens). These tokens are used to authenticate and authorize users for protected API routes.
* **Restaurants:** Manages the creation, updating, and retrieval of restaurant profiles, including their general information and categories.
* **Products:** Represents the menu items. Products are directly linked to specific restaurants and contain details like name, description, and price.
* **Search:** A global search engine endpoint that queries across multiple entities simultaneously, allowing users to find matching restaurants and products using free-text keywords.

## Instructions & API Specifications

### CRITICAL: Environment Configuration

**Before running the application, a `.env` file MUST exist inside the `config` directory with the following exact environment variables:** (SHOULD BE THERE - JUST CHECK)

```
NODE_PORT=3000
CPP_SERVER_PORT=8080
CPP_SERVER_HOST=cpp-server
```

These variables are required for proper communication between the Node.js server and the C++ recommendation engine. Failure to include these variables will result in connection failures.

---

### API Entity Documentation

This section provides detailed specifications for all entities that can be created via the REST API. Each specification includes mandatory fields, data types, and validation rules to ensure proper API usage.

#### 1. **User Entity**

**Purpose:** Manages user profiles and authentication for the food delivery platform.

**Create User Endpoint:** `POST /api/users`

| Field | Type | Mandatory | Constraints & Validation |
|-------|------|-----------|--------------------------|
| `username` | String | ✅ Yes | Must be unique. Cannot already exist in the system. |
| `password` | String | ✅ Yes | Cannot be empty. Stored as provided (no hashing in this version). |
| `name` | String | ✅ Yes | Cannot be empty. User's full name. |
| `phone` | String | ✅ Yes | Cannot be empty. User's contact phone number. |
| `address` | String | ✅ Yes | Cannot be empty. User's physical address. |

**Example Request:**
```bash
curl -i -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"username": "yahav",
    "password": "Password123!",
    "name": "Yahav",
    "phone": "0501234567",
    "address": "Ramat Gan"}'
```

**Validation Error Response (400 Bad Request):**
- Missing any required field → `"All fields are required: username, password, name, phone, address"`
- Duplicate username → `"Username already exists"`

---

#### 2. **Restaurant Entity**

**Purpose:** Manages restaurant profiles, including basic information, categories, and operational details.

**Create Restaurant Endpoint:** `POST /api/restaurants`

| Field | Type | Mandatory | Constraints & Validation |
|-------|------|-----------|--------------------------|
| `name` | String | ✅ Yes | Cannot be empty. Restaurant name. |
| `address` | String | ✅ Yes | Cannot be empty. Restaurant's physical location. |
| `phone` | String | ✅ Yes | Cannot be empty. Restaurant's contact phone number. |
| `kosher` | Boolean | ✅ Yes | Cannot be undefined or null. Must be explicitly `true` or `false`. |
| `working_hours` | String | ✅ Yes | Cannot be empty. Operating hours (e.g., "9:00-22:00"). |
| `description` | String | ❌ No | Optional. Short description for search queries and display. |

**Example Request:**
```bash
curl -i -X POST http://localhost:3000/api/restaurants \
-H "Content-Type: application/json" \
-d '{"name": "Burger Joint",
    "description": "Best burgers",
    "address": "Ramat Gan",
    "phone": "054545454",
    "kosher": true,
    "working_hours": "9 to 5"}'
```

**Validation Error Response (400 Bad Request):**
- Missing any required field → `"Name, address, phone, kosher, and working hours are required"`

---

#### 3. **Product Entity**

**Purpose:** Represents menu items offered by a restaurant. Products are directly linked to a specific restaurant.

**Create Product Endpoint:** `POST /api/restaurants/{restaurantId}/products`

| Field | Type | Mandatory | Constraints & Validation |
|-------|------|-----------|--------------------------|
| `name` | String | ✅ Yes | Cannot be empty. Product/menu item name. |
| `price` | Number | ✅ Yes | Must be a numeric value. Represents the price in currency units (e.g., dollars, euros). Must be non-negative. |
| `description` | String | ❌ No | Optional. Details about the product, ingredients, or preparation notes. Defaults to empty string if not provided. |

**Example Request:**
```bash
curl -i -X POST http://localhost:3000/api/restaurants/{restaurantId}/products \
-H "Content-Type: application/json" \
-d '{"name": "Double Burger",
    "price": 55,
    "description": "Extra cheese"}'
```

**Validation Error Response (400 Bad Request):**
- Missing name or price → `"Invalid input: name and price are required"`
- Price is not a number → `"Invalid input: name and price are required"`
- Restaurant not found → `"Restaurant not found"`

---

#### 4. **Order Entity**

**Purpose:** Manages food delivery orders, including items, totals, and delivery address.

**Create Order Endpoint:** `POST /api/orders`

**Required Header:** `Authorization: {userId}`

| Field | Type | Mandatory | Constraints & Validation |
|-------|------|-----------|--------------------------|
| `restaurantId` | String | ✅ Yes | Must reference a valid, existing restaurant. |
| `items` | Array | ✅ Yes | Array of order items. Must contain at least one item. Each item must have `productId` (String) and `quantity` (Number). |
| `address` | String | ✅ Yes | Cannot be empty. Delivery address for the order. |
| `tip` | Number | ❌ No | Optional. Tip amount (defaults to 0 if not provided). Must be a non-negative number. |

**Item Object Structure:**
```json
{
  "productId": "uuid-of-product",
  "quantity": 2
}
```

**Example Structure:**
```json
{
  "restaurantId": "restaurant-uuid",
  "items": [
    {
      "productId": "product-uuid-1",
      "quantity": 2
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1
    }
  ],
  "address": "789 Elm Street, Apt 5B",
  "tip": 5.00
}
```
**Example Request:**
```bash
curl -i -X POST http://localhost:3000/api/orders \
-H "Content-Type: application/json" \
-H "Authorization: {userID} \
-d '{
    "restaurantId": "{restaurantId}",
    "items": [{"productId": "{productId}", "quantity": 2}],
	  "address": "Dizengoff 50, Tel Aviv"}'
```




**Validation Error Response (400/404):**
- Missing authorization header → `"Missing authorization header"`
- Missing items array or empty array → `"Order must contain at least one item"`
- Missing restaurantId or address → `"Missing restaurantId or address"`
- Product not found or not in restaurant → `"Products or Restaurant not found"` (404)

---

---
## Build Instructions 

### 1. Build the Project
First, open your terminal in the main project directory (where the docker-compose.yml is located) and build the Docker images:
```bash
docker compose build --no-cache
```
    

### 2. Run the Servers
To start the servers in the background, type the following command (ports and IPs are automatically loaded from the `.env` file under the `config` directory):
```bash
docker compose up -d
```


### 3. View Node.js Live Logs (Optional)
If you want to see the live logs of the Node.js server streaming in your terminal, run the following command. 
(Notice: This keeps the terminal attached to the logs. You will need to open another terminal window to run new commands):
```bash
docker compose logs -f web-js-server
```
      

### 4. Run the Unit Tests (optional)
If you want to run the GoogleTest suite instead of the main interactive program, use this command:
```bash
docker compose run --rm tests
```


### 5. Stop the Server
The server runs continuously in the background. When you are done checking the project, use this command to safely stop and remove the containers:
```bash       
docker compose down
```


## Pictures For Example

### Compilation Example:
![Compilation Example](picturesForREADME/1.png)

### Run Example 1:

User Registration & Token Retrieval
![Run Example 1](picturesForREADME/2.png)

### Run Example 2:
Create a Restaurant & Update Description
![Run Example 2](picturesForREADME/3.png)

### Run Example 3:
 Add Products & Retrieve Menu
![Run Example 3](picturesForREADME/4.png)

### Run Example 4:
 Global Search
![Run Example 4](picturesForREADME/5.png)



