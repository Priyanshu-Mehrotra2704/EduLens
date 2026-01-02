# EduLens Backend Server

This directory contains the Node.js backend for EduLens. It handles API requests, database interactions, and authentication.

## 📂 Folder Structure

- **Controllers/**: Contains the business logic for each route. This is where the actual work happens when an API endpoint is hit.
- **Models/**: Defines the database schema using Mongoose. This tells the application what data looks like in MongoDB.
- **Routes/**: Defines the API endpoints (URLs) and maps them to specific controllers.
- **Middleware/**: Functions that run before the final request handler (e.g., checking if a user is logged in).
- **index.js**: The entry point of the server. It sets up the database connection, middleware, and starts the server.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Make sure you have a `.env` file in this directory with the following keys:
    - `PORT`: The port the server runs on (default: 3000)
    - `MONGODB_URI`: Your MongoDB connection string
    - `JWT_SECRET`: Secret key for signing tokens
    - `DEFAULT_ADMIN_EMAIL`: Email for the default admin account
    - `DEFAULT_ADMIN_PASSWORD`: Password for the default admin account
    - `EMAIL_USER`: Email address for sending notifications (optional)
    - `EMAIL_PASS`: App password for the email (optional)

3.  **Run the Server**:
    - Development mode (restarts on changes):
      ```bash
      npm run dev
      ```
    - Production mode:
      ```bash
      npm start
      ```

## 🛠️ Key Technologies

- **Express**: Framework for building the web server.
- **Mongoose**: Library for interacting with MongoDB.
- **JWT (JsonWebToken)**: Used for secure user authentication.
- **Bcrypt**: Used to hash passwords (make them unreadable) for security.
- **Cors**: Allows the frontend to communicate with this backend.
