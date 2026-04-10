# CareerBridge

CareerBridge is a comprehensive application for managing career opportunities, bridging the gap between job seekers and employers/administrators. It features a scalable backend API and two distinct frontend portals out of the box: one for normal users (User Portal) and one for administrative tasks (Admin Portal).

## 🚀 Features

- **User Portal:** A dedicated interface for users/candidates to browse opportunities, manage their profiles, and interact with the platform.
- **Admin Portal:** A standalone, secure application for administrators to manage postings, review candidates, and monitor system activity.
- **Robust Backend API:** A centralized Node.js and Express server that powers both portals with secure authentication, file uploading, and database integration.

## 🏗 Directory Structure

This repository is structured containing three distinct projects:

- `/admin-portal` - The React frontend application for administrators.
- `/backend` - The Express REST API and server back end.
- `/user-portal` - The React frontend application for normal users.

## 💻 Tech Stack

**Frontend (Admin & User Portals):**
- React.js 18
- React Router DOM v6
- Axios for API requests

**Backend:**
- Node.js & Express.js
- Mongoose (MongoDB Object Modeling)
- JSON Web Tokens (JWT) & bcryptjs for Authentication
- Multer for File Uploads

## 🛠 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed before starting. A MongoDB database instance is also required.

## 🏁 Getting Started

### 1. Backend Environment Setup
Navigate to the `backend` directory and create a `.env` file. You will need to define your environment configurations, such as your MongoDB connection string, JWT secrets, and PORT.

### 2. Install Dependencies
Install dependencies individually for the backend and the frontend parts you plan to run.

```bash
# Backend
cd backend
npm install

# User Portal
cd ../user-portal
npm install

# Admin Portal
cd ../admin-portal
npm install
```

### 3. Running the Applications

Fire up the frontend dev servers and the node backend. *Note: Both React portals proxy API requests to `http://localhost:5000` by default.*

**Start the Backend API:**
```bash
cd backend
npm run dev
```

**Start the User Portal:**
```bash
cd user-portal
npm start
```

**Start the Admin Portal:**
```bash
cd admin-portal
npm start
```

## 🤝 Contributing
Feel free to open an issue or submit a pull request for improvements and bug fixes.
