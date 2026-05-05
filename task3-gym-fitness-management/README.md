# 🏋️‍♂️ Pak Gym - Comprehensive Fitness Management System

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/pak-gym?style=for-the-badge)](https://github.com/yourusername/pak-gym)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**Pak Gym** is a premium, full-stack fitness management solution designed to streamline gym operations, enhance member engagement, and simplify administrative tasks. From automated class scheduling to secure payment processing, Pak Gym provides a seamless experience for admins, trainers, and members alike.

---

## 🌟 Key Features

### 🛡️ Role-Based Access Control
- **Admin Dashboard**: Full control over gym operations, user management, and financial reporting.
- **Trainer Portal**: Manage schedules, upload workout/diet plans, and track client progress.
- **Member Experience**: Personal dashboard to book classes, track attendance, and manage subscriptions.

### 📅 Advanced Scheduling
- Real-time class booking system.
- Dynamic trainer management and availability tracking.

### 💳 Secure Payments & Subscriptions
- Integrated with **Stripe** for recurring billing and one-time payments.
- Transparent subscription management for members.

### 📊 Performance Tracking
- **Workout & Diet Plans**: Trainers can upload personalized PDF/Image plans.
- **Attendance System**: QR-code based or manual attendance tracking for precision.

### 🔔 Smart Notifications
- Automated email alerts via **Nodemailer** for registration, payments, and class reminders.
- (Optional) SMS integration for critical updates.

### 📱 Responsive & Modern UI
- Fully responsive design for Mobile, Tablet, and Desktop.
- Smooth animations powered by **Framer Motion**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Styled-components](https://styled-components.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State/Form Management**: React Hook Form & Yup
- **Icons**: Lucide React
- **Auth**: [Firebase Authentication](https://firebase.google.com/products/auth)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Security**: Firebase Admin SDK
- **Payments**: [Stripe API](https://stripe.com/)
- **Email**: Nodemailer

---

## 🚀 Getting Started (Deployment & Testing)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)
- Firebase Project (for Auth & Admin SDK)
- Stripe Account (for Payments)
- Gmail Account (for Nodemailer SMTP)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pak-gym.git
   cd pak-gym
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   **Environment Variables Setup:**
   - Copy the dummy `.env.example` file to create your own `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your actual credentials (MongoDB URI, Firebase details, SMTP, Stripe keys).
   - **Important Security Note:** The real `.env` file and the `firebase-adminsdk.json` key are ignored via `.gitignore`. Never commit these sensitive files to GitHub.
   
   **Firebase Admin SDK Setup:**
   - Go to your Firebase Console -> Project Settings -> Service Accounts -> Generate New Private Key.
   - Save the downloaded JSON file into the `backend/` directory. Make sure its name matches the ignore pattern `*firebase-adminsdk*.json` so it isn't uploaded.

   **Run the Backend:**
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   **Environment Variables Setup:**
   - Copy the `.env.example` file to create your `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your Firebase Web Configuration and Stripe Publishable Key. This ensures your frontend connects to your own Firebase project for authentication.
   
   **Run the Frontend:**
   ```bash
   npm run dev
   ```

---

## 🔐 Environment Variables Guide

To easily deploy this app, we have provided `.env.example` files in both the frontend and backend. These files demonstrate the required variables and their formats without exposing the original credentials.

### Backend `.env.example`
Provides templates for `PORT`, `MONGO_URI`, `FIREBASE_PROJECT_ID`, `SMTP` configurations, `STRIPE_SECRET_KEY`, and more.

### Frontend `.env.example`
Provides templates for `VITE_API_URL`, Firebase web SDK config (`VITE_FIREBASE_API_KEY`, etc.), and `VITE_STRIPE_PUBLISHABLE_KEY`.

---

## 📂 Project Structure

```text
pak-gym/
├── frontend/             # React Client
│   ├── .env.example      # Dummy env template for frontend
│   ├── .gitignore        # Ignores node_modules, real .env, dist
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Dashboard, Login, Landing
│   │   └── context/      # Auth & State management
├── backend/              # Express Server
│   ├── .env.example      # Dummy env template for backend
│   ├── .gitignore        # Ignores real .env, Firebase keys, uploads
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API Endpoints
│   ├── controllers/      # Business Logic
│   └── middleware/       # Auth & Error handling
└── README.md
```

---

## 🤝 Contributing
Contributions are welcome! If you want to run this locally to test or add features, follow the "Getting Started" guide above to configure your local test environment securely.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Developed with ❤️ as part of my Full-Stack Development Internship.
