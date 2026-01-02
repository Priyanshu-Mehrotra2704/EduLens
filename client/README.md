# EduLens Frontend

This directory contains the React frontend for EduLens. It's built with [Vite](https://vitejs.dev/) for fast development.

## 📂 Folder Structure

- **src/**: Source code
  - **admin_components/** & **admin_pages/**: Components and pages specific to the Admin role.
  - **teacher_components/** & **teacher_pages/**: Components and pages specific to the Teacher role.
  - **user_components/** & **user_pages/**: Components and pages specific to the Student role.
  - **authentication_pages/**: Login, Register, and VerifyEmail pages.
  - **components/**: Shared components (like ProtectedRoute).
  - **assets/**: Images, fonts, etc.
  - **utils/**: Utility functions.
  - **App.jsx**: The main component that handles routing.
  - **main.jsx**: The entry point where the React app is mounted to the DOM.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file (or `.env.local`) in this directory if you need to override defaults.
    - `VITE_API_URL`: The URL of the backend server (default might be hardcoded as `http://localhost:3000` or similar).

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The app will usually open at `http://localhost:5173`.

## 🛠️ Key Libraries

- **React**: The UI library.
- **React Router (react-router-dom)**: Handles navigation between pages (routes).
- **Axios**: Used to make HTTP requests to the backend API.
- **Tailwind CSS** (likely): For styling.
