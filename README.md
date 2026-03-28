
AI Interview Preparation API

A powerful backend API built with **Node.js**, **Express**, and **JWT Authentication** that helps users prepare for interviews using **Gen-AI**. The system analyzes user input (resume, job description, etc.) and generates:

* ✅ Technical Questions
* ✅ Behavioral Questions
* ✅ Match Score
* ✅ Skill Gap Analysis
* ✅ Personalized Preparation Plan

---

## 🧠 Features

* 🔐 **Authentication (JWT आधारित)**

  * User Registration
  * User Login
  * Secure token-based authentication

* 🛡️ **Protected Routes**

  * Middleware to verify JWT
  * Access control for sensitive endpoints

* 🤖 **AI-Powered Interview Generation**

  * Takes:

    * Job Description
    * Resume / User Description
  * Generates:

    * Technical Questions
    * Behavioral Questions
    * Match Score
    * Preparation Plan (daily tasks & focus)

* 📊 **Interview Reports**

  * View detailed reports using interview ID

* 🌐 **CORS Enabled**

  * Secure cross-origin communication for frontend integration

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express.js
* **Authentication:** JWT (JSON Web Tokens)
* **Middleware:** Custom auth middleware
* **AI Integration:** Gen-AI APIs
* **Other:** CORS, dotenv

---

## 📁 Project Structure

```
├── controllers/
├── routes/
│   ├── authRoutes.js
│   ├── interviewRoutes.js
├── middleware/
│   └── authMiddleware.js
|   |-- fileMiddleware.js
├── models/
├── utils/
├── config/
├── app.js
├── server.js
└── .env
```

---

## 🔑 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

---

### 🏠 General Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/`      | Home route  |

---

### 🎯 Interview Routes (Protected)

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| POST   | `/api/interview`     | Generate interview content using AI |
| GET    | `/api/interview/:id` | Get interview report by ID          |

---

## 🔒 Authentication Flow

1. User logs in / registers
2. Server returns JWT token
3. Token is sent in cookies:

```
Authorization: Bearer <token>
```

4. Middleware verifies token for protected routes

---

## ⚙️ Environment Variables

Create a `.env` file in root:

```
PORT=5000
MONGO_URL= your_mongodb_url
JWT_SECRET=your_secret_key
AI_API_KEY=your_genai_key
```

---

## ▶️ Getting Started

### 1️⃣ Clone the repo

```
git clone https://github.com/viveksharma-webdev/TalentProbe-AI.git
cd your-repo
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Run the server

```
npm run dev
```

## 📌 Example Request

### Generate Interview

```
POST /api/interview
Authorization: Bearer <token>

Body:
{
  "jobDescription": "Frontend Developer role...",
  "userProfile": "MERN stack developer..."
}
```
## 📈 Future Improvements

* ✅ Add role-based access control
* ✅ Save user progress analytics
* ✅ Add real-time interview simulation
* ✅ Improve AI response accuracy

## 🤝 Contributing

Feel free to fork this repo and submit pull requests.

## 📜 License

This project is licensed under the **MIT License**
