# Pak Media - Complete Social Media Platform

A robust, customized social media platform built with the MERN stack (Next.js 16 on the frontend instead of React, and Express + MongoDB on the backend). 

## 🚀 Features implemented (Core Requirements)
1. **User Profiles:** Basic custom authentication built using simple Username tracking (as requested for a basic system without complex tokenized auth). Follow & Unfollow operations built-in.
2. **Posts Content:** A home feed component where users can view and write posts.
3. **Likes & Comments:** Multi-layered interaction. The app has a Like/Unlike feature that toggles and a fully functional commenting section underneath each post.
4. **Rich Aesthetic:** Built using a high-fidelity Vanilla CSS dark mode architecture mimicking leading modern systems, without external design frameworks, maximizing maintainable code.

## 🛠 Tech Stack
- Frontend: `Next.js 16`, `React 19`
- Server: `Express`, `Node.js`
- Database: `MongoDB` via `Mongoose`

## 🏃‍♂ Run Instructions

### 1. Database
Make sure you have MongoDB installed and running on `localhost:27017`. The app uses the local database `pakmedia`.

### 2. Startup Servers
Open two terminal windows.
**Terminal 1 (Backend):**
```bash
cd backend
npm install   # If not already installed
npm start
```
*The server will run on http://localhost:5000*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install   # If not already installed
npm run dev
```
*The web app will run on http://localhost:3000*

## 📚 General Project Architecture

- **`backend/models/`**: MongoDB schemas (User, Post, Comment).
- **`backend/routes/`**: Express API Endpoints strictly mapped to REST verbs (GET, POST).
- **`backend/db.js`**: Standardized driver to safely handle connection state to Mongo.
- **`frontend/src/app/`**: Next.js App Router for dynamic routing (feed & profile routes).
- **`frontend/src/context/`**: React Context for global App state management (User Session state).
- **`frontend/src/components/`**: Reusable generic blocks (Navbar, PostCard, AuthBox).
