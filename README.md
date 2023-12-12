# FoodExplorer - Backend
This is the Final Project of the Explorer Module - RocketSeat Programming School.

Welcome to the backend repository for the **FoodExplorer** project. This backend was developed using Node.js, Express.js, and SQLite to support the frontend application that enables the exploration of a restaurant menu and the placement of orders.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **SQLite**: Embedded relational database.

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/eduaardofranco/foodExplorerAPI.git
   cd foodExplorerAPI
2. **Install Dependencies**:
````bash
npm install
````
3. **Environment variables**:

Rename the .env.example file to .env and adjust the variables as needed.

4. **Run the Server**:
````bash
npm run dev
````

## JWT Token for Session Management

This backend uses JSON Web Tokens (JWT) for session management. JWT is a secure way to represent user sessions and is employed to enhance the security of user authentication.

### How JWT is Used

1. **User Authentication**: After a successful login, a JWT is generated on the server.

2. **Token Inclusion**: The server sends the JWT to the client, which includes it in the headers of subsequent requests.

3. **Token Verification**: The server verifies the JWT on protected routes, ensuring the user's identity and permissions.

## Deploy
You can access the frontend side through:
 https://thefoodexplorer.netlify.app