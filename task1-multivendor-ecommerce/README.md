# LuxeMarket - Multi-Vendor eCommerce Platform

LuxeMarket is a modern, responsive, and robust multi-vendor eCommerce platform built with Next.js 16, Tailwind CSS v4, Node.js, Express, and MongoDB. It allows vendors to list their products, customers to shop, and admins to oversee the entire platform.

## Features

*   **Role-Based Access Control**:
    *   **Customer**: Browse products, add to cart, place orders, and view order history.
    *   **Vendor**: Dashboard to manage their own products (create, update, delete).
    *   **Admin**: Dashboard to manage all users, view all products, and manage all orders.
*   **Modern Frontend**:
    *   Built with Next.js 16 App Router for fast, SEO-friendly rendering.
    *   Styled with Tailwind CSS v4 for a premium, responsive UI.
    *   State management with Zustand.
*   **Robust Backend**:
    *   Node.js and Express API.
    *   MongoDB for scalable data storage.
    *   JWT Authentication and bcrypt password hashing.

## Tech Stack

*   **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Zustand, Framer Motion, Axios.
*   **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT).

## Installation

### Prerequisites

*   Node.js (v18+)
*   MongoDB (Local or Atlas)

### Setup Backend

1.  Navigate to the `backend` directory: 
    ```bash
    cd backend
    ```
2.  Install dependencies: 
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Copy the provided `.env.example` file and rename it to `.env`:
    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and update it with your own credentials (e.g. `PORT`, `MONGO_URI`, and `JWT_SECRET`).
    
    *Note: The `.env` file is intentionally ignored by git to protect your sensitive credentials.*

4.  Run the server: 
    ```bash
    npm run dev
    ```

### Setup Frontend

1.  Navigate to the `frontend` directory: 
    ```bash
    cd frontend
    ```
2.  Install dependencies: 
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Copy the provided `.env.example` file and rename it to `.env` or `.env.local`:
    ```bash
    cp .env.example .env
    ```
    Update the `NEXT_PUBLIC_API_URL` if your backend is running on a different URL/port.

    *Note: Sensitive environment files are properly ignored in `.gitignore`.*

4.  Run the application: 
    ```bash
    npm run dev
    ```
5.  Visit `http://localhost:3000` to view the frontend in your browser.

## Git Workflow & Deployment

- **.gitignore Setup**: Both frontend and backend directories have properly configured `.gitignore` files. This ensures that sensitive information (`.env`), build directories (`.next`, `dist`), and large dependencies (`node_modules`) are excluded from source control.
- **Environment Variables**: Never commit real `.env` files. Instead, use the provided `.env.example` templates to set up your keys on your deployment platform (e.g., Vercel for the frontend, Render/Heroku/Railway for the backend).

## Clean Architecture

The project adheres to clean code principles, separating concerns between controllers, models, and routes on the backend, and utilizing modular components, Zustand stores, and separate API abstractions on the frontend.
