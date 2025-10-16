#  Recommender — AI-Powered Course Recommendation

This repository contains submission for the **Senior MERN Full-Stack Technical Assessment**.

It demonstrates:

- Backend microservices in **Node.js (TypeScript)** with **MongoDB**, **Redis**, and **Elasticsearch**
- AI integration using **Gemini API**
- Frontend built in **React (JavaScript)** — clean, responsive, and minimal
- Full **Docker Compose** setup with **Nginx** reverse proxy & centralized auth
- Practical DevOps understanding — CI/CD, Docker, deployment, and Kafka usage

---

## 🚀 Run the Project (End-to-End)

### 1️⃣ Prerequisites

Ensure the following are installed:

- Docker & Docker Compose
- Node.js
- Git
- Postman

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/bhanusharma2252001/recommender.git
cd recommender
```

### 3️⃣ Start All Services

```bash
docker-compose up --build
```

This will start:

- **auth-service** (JWT-based admin authentication)
- **course-service** (upload, search, caching)
- **recommendation-service** (Gemini API)
- **Redis**, **MongoDB**, **Elasticsearch**
- **frontend** (React app)
- **Nginx** (reverse proxy for all routes)

Visit `http://localhost`

---

### 4️⃣ Admin Signup & Login

Before using the frontend login:

1. Hit the **signup API** to create an admin account:

   ```
   POST /api/auth/signup
   Body: { "email": "admin@example.com", "password": "yourpassword" }
   ```

2. After signup, you can login via frontend using the same credentials.
3. Optionally, you can use the provided **Postman collection** `recommendor.postman_collection.json` in the repo to test APIs quickly.

---

## Microservices Overview

### Authentication Service

- Handles **Admin Signup & Login**
- Passwords hashed using **bcrypt**
- Generates **JWT Tokens**
- Protects admin-only routes

###  Recommendation Service

- Integrates with **Gemini AI API**
- `/api/recommendations` endpoint for course suggestions
- Mock responses provided if API key unavailable

###  Course Service

- Upload CSV to MongoDB
- Index courses in Elasticsearch
- Redis cache for frequently accessed data
- Search endpoint supports pagination, total count

---

##  DevOps Section Answers

### **2a. CI/CD Pipeline Sketch**

- **Code Commit:** GitHub
- **Build & Test:** GitHub Actions (runs Jest/unit tests)
- **Docker Build & Push:** Builds and pushes images to Docker Hub
- **Deploy:** Docker Compose or Kubernetes
- **Tools:** GitHub Actions, Docker Hub, DigitalOcean / AWS EC2

### **2b. Dockerization**

Each microservice includes its own Dockerfile. Example for `auth-service`:

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4001
CMD ["npm", "start"]
```

Build & Run:

```bash
docker build -t auth-service .
docker run -p 4001:4001 auth-service
```

### **2c. Linux Hosting Considerations**

- **Nginx** as reverse proxy
- **PM2** to manage Node.js processes
- **Environment variables** stored securely via `.env`
- Multiple microservices managed via **Docker Compose network**

### **2d. Kafka Usage (Conceptual)**

Kafka can be used for:

- **Event-driven communication** between services (e.g., course upload triggers recommendation recalculation)
- **Activity logging and analytics**
- **Async notifications** (e.g., admin notified on new course uploads)

---

## Frontend Overview

- Minimal React JS app with clean UI and responsive layout
- Integrates with backend APIs via Axios
- Features:

  - Admin Login (after hitting signup API first)
  - Course listing with pagination and total count
  - Elasticsearch-powered search
  - AI Recommendations Page

---

##  Environment Variables

For simplicity, the repo has only 1 `.env` file, but each service will have its own `.env` in production:

```bash
MONGO_URI=mongodb://mongo:27017/coursesdb
JWT_SECRET=supersecret
REDIS_HOST=redis
ELASTICSEARCH_URL=http://elasticsearch:9200
GEMINI_API_KEY=GEMINI_API_KEY
```

---

## 📂 Folder Structure

```
/backend
  ├── auth-service/
  ├── course-service/
  ├── recommendation-service/
frontend/
  ├── src/
      ├── components/
      ├── pages/
      ├── services/
nginx/
  ├── default.conf
docker-compose.yml
Postman/
  ├── recommender.postman_collection.json
```

---

## Author

**Bhavnesh Sharma**.<br />
Software Engineer.<br />
 Email: [bhanusharma252001@gmail.com](mailto:bhanusharma252001@gmail.com)
<br />LinkedIn: [https://www.linkedin.com/in/bhavnesh-sharma-208134177/](https://www.linkedin.com/in/bhavnesh-sharma-208134177/)
