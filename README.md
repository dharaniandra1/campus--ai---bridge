Campus AI Bridge
A full-stack AI-powered placement readiness platform for students.
It helps students analyze skills, check placement eligibility, get job recommendations, upload resumes for ATS-style feedback, generate interview questions, and receive AI learning roadmaps.
The project uses OpenRouter's OpenAI-compatible API for AI-powered placement features. The frontend calls the backend, and the backend securely calls the AI provider.
---
Features
Student Features
Student login
Student profile management
Skill gap analysis
Placement score prediction
AI eligibility checker
Job recommendations
Resume PDF upload and analysis
ATS-style resume score
Resume strengths and missing skills
Resume improvement roadmap
Mock interview question generation
Learning roadmap generation
Admin Features
Admin login
Admin dashboard
Add student
View students
Assign tasks
View leaderboard
Analytics dashboard
---
Technology Stack
Frontend
React.js
React Router DOM
Axios
Bootstrap

CSS
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Multer
pdf-parse
Axios
AI Integration
OpenRouter API
OpenAI-compatible SDK
Free model: `openai/gpt-oss-120b:free`
Recommended model:
```bash
gemma4:3b-cloud
```
You can also use:
```bash
llama3.2
```
or:
```bash
gemma3:4b
```
---
Project Purpose
Campus AI Bridge is a placement readiness platform.
Students can enter their skills, CGPA, branch, resume, and career goal. The backend sends this information to OpenRouter. The AI model generates results such as:
Skill gaps
Missing technologies
Placement readiness score
Job role recommendations
Resume feedback
Resume ATS score
Learning roadmap
Interview questions
Company recommendations
The frontend never directly calls OpenRouter. The API key stays only in the backend `.env` file.
Flow:
```text
React Frontend
      ↓
Node.js + Express Backend
      ↓
OpenRouter API
      ↓
OpenAI GPT-OSS Free Model
```
---
Project Structure
```text
Campus-AI-Bridge/
│
├── .gitignore
├── README.md
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   └── studentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadResume.js
│   │
│   ├── models/
│   │   ├── Student.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   └── studentRoutes.js
│   │
│   ├── utils/
│   │   └── parseGemma.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    │
    ├── src/
    │   ├── components/
    │   │   ├── AdminMenu.js
    │   │   ├── AppLayout.js
    │   │   ├── EmptyState.js
    │   │   ├── ProtectedRoute.js
    │   │   ├── ResultList.js
    │   │   └── StatCard.js
    │   │
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── StudentProfile.js
    │   │   ├── SkillGap.js
    │   │   ├── PlacementScore.js
    │   │   ├── JobRecommendation.js
    │   │   ├── AIEligibility.js
    │   │   ├── ResumeAnalyzer.js
    │   │   ├── MockInterview.js
    │   │   ├── AdminDashboard.js
    │   │   ├── AddStudent.js
    │   │   ├── ViewStudents.js
    │   │   ├── AssignTask.js
    │   │   ├── Leaderboard.js
    │   │   └── Analytics.js
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── utils/
    │   │   └── auth.js
    │   │
    │   ├── App.css
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    │
    ├── .env
    └── package.json
```
---
Installation
1. Clone the Project
```bash
git clone https://github.com/LankaVenkataYagnesh/campus-ai-bridge.git
```
```bash
cd campus-ai-bridge
```
---
Backend Setup
Open a terminal in the backend folder:
```bash
cd backend
```
Install backend dependencies:
```bash
npm install
```
If dependencies are missing, install them manually:
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken axios multer pdf-parse
```
For development mode:
```bash
npm install --save-dev nodemon
```
---
Frontend Setup
Open another terminal.
Go to frontend folder:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
If React Router or Axios is missing:
```bash
npm install react-router-dom axios bootstrap
```
---
OpenRouter Setup
Create an account at OpenRouter.
Create an API key.
Keep the key private. Do not put it in frontend files or commit it to GitHub.
Add it only to `backend/.env`.
No Ollama installation or model download is needed.
---
Environment Variables
Backend `.env`
Create this file:
```text
backend/.env
```
Add:
```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/campus_ai_bridge

JWT_SECRET=campus_ai_bridge_secret_2026

OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-oss-120b:free
```
If you use another model:
```env
OPENROUTER_MODEL=openrouter/free
```
---
Frontend `.env`
Create this file:
```text
frontend/.env
```
Add:
```env
REACT_APP_API_URL=http://localhost:5000/api
```
---
Run the Application
You need three things running:
MongoDB
Ollama
Backend and frontend
---
Start MongoDB
If MongoDB is installed locally:
```bash
mongod
```
If MongoDB is already running as a Windows service, you do not need this command.
Check MongoDB connection in backend terminal:
```text
MongoDB Connected: 127.0.0.1
```
---
Start Ollama
Usually Ollama starts automatically after installation.
To manually start it:
```bash
ollama serve
```
Ollama API runs at:
```text
http://127.0.0.1:11434
```
---
Start Backend
Open terminal:
```bash
cd backend
```
Run:
```bash
node server.js
```
Or development mode:
```bash
npx nodemon server.js
```
Expected output:
```text
Server running on port 5000
MongoDB Connected: 127.0.0.1
AI Engine: OpenRouter Free Model
```
Backend URL:
```text
http://localhost:5000
```
---
Start Frontend
Open another terminal:
```bash
cd frontend
```
Run:
```bash
npm start
```
Frontend URL:
```text
http://localhost:3000
```
---
API Documentation
Base URL:
```text
http://localhost:5000/api
```
---
Authentication APIs
Register User
```http
POST /auth/register
```
Example body:
```json
{
  "name": "Yagnesh",
  "email": "yagnesh@gmail.com",
  "password": "123456",
  "role": "student"
}
```
---
Login User
```http
POST /auth/login
```
Example body:
```json
{
  "email": "yagnesh@gmail.com",
  "password": "123456"
}
```
---
AI APIs
Skill Gap Analysis
```http
POST /ai/skill-gap
```
Example body:
```json
{
  "branch": "ECE",
  "skills": ["C", "React", "MongoDB"]
}
```
---
Placement Score
```http
POST /ai/placement-score
```
Example body:
```json
{
  "cgpa": 6.5,
  "skills": ["React", "Node.js", "MongoDB"],
  "projects": 2
}
```
---
Learning Roadmap
```http
POST /ai/learning-roadmap
```
Example body:
```json
{
  "goal": "MERN Developer",
  "skills": ["HTML", "CSS", "JavaScript"]
}
```
---
Job Recommendation
```http
POST /ai/job-recommendation
```
Example body:
```json
{
  "cgpa": 6.5,
  "skills": ["React", "Node.js", "MongoDB"]
}
```
---
AI Eligibility Checker
```http
POST /ai/ai-eligibility
```
Example body:
```json
{
  "goal": "Frontend Developer",
  "skills": ["HTML", "CSS", "JavaScript", "React"]
}
```
---
Mock Interview
```http
POST /ai/mock-interview
```
Example body:
```json
{
  "role": "MERN Stack Developer"
}
```
---
Resume Analyzer
```http
POST /ai/resume-analyzer
```
Content type:
```text
multipart/form-data
```
Form-data field:
```text
resume = resume.pdf
```
Rules:
```text
File type: PDF
Maximum size: 5 MB
Field name: resume
```
---
OpenRouter Integration Code
Backend Ollama Request
File:
```text
backend/controllers/aiController.js
```
```js
const axios = require("axios");

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const OLLAMA_MODEL = "gemma4:3b-cloud";

const getAIResponse = async (prompt) => {
  const response = await axios.post(OLLAMA_URL, {
    model: OLLAMA_MODEL,
    prompt,
    stream: false
  });

  return response.data.response;
};
```
---
Resume PDF Upload Route
File:
```text
backend/routes/aiRoutes.js
```
```js
const express = require("express");
const multer = require("multer");

const router = express.Router();

const { resumeAnalyzer } = require("../controllers/aiController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

router.post(
  "/resume-analyzer",
  upload.single("resume"),
  resumeAnalyzer
);

module.exports = router;
```
---
Frontend Resume Upload Request
File:
```text
frontend/src/pages/ResumeAnalyzer.js
```
```js
const formData = new FormData();

formData.append("resume", resumeFile);

const response = await API.post(
  "/ai/resume-analyzer",
  formData
);
```
Do not manually set:
```text
Content-Type: multipart/form-data
```
Axios automatically adds the correct boundary.
---
Build for Production
Build Frontend
```bash
cd frontend
```
```bash
npm run build
```
This creates:
```text
frontend/build
```
---
Backend Production Start
```bash
cd backend
```
```bash
node server.js
```
---
Testing Commands
Backend Test
Test server:
```bash
curl http://localhost:5000
```
Test skill gap API:
```bash
curl -X POST http://localhost:5000/api/ai/skill-gap ^
-H "Content-Type: application/json" ^
-d "{\"branch\":\"ECE\",\"skills\":[\"C\",\"React\"]}"
```
---
Test Ollama
```bash
ollama list
```
Expected output should show your model:
```text
gemma4:3b-cloud
```
Test Ollama API:
```bash
curl http://127.0.0.1:11434/api/tags
```
---
Frontend Test
```bash
cd frontend
npm test
```
---
Docker Setup
Docker is optional.
Important: Ollama works best directly on your laptop. Dockerizing Ollama is possible but requires extra setup, especially if GPU support is needed.
---
Backend Dockerfile
Create:
```text
backend/Dockerfile
```
```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```
---
Frontend Dockerfile
Create:
```text
frontend/Dockerfile
```
```dockerfile
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
```
---
docker-compose.yml
Create in root folder:
```text
Campus-AI-Bridge/docker-compose.yml
```
```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
```
Run Docker:
```bash
docker-compose up --build
```
---
Deployment Instructions
Frontend Deployment
Deploy frontend to Vercel.
Steps:
Create an account.
Import your GitHub repository.
Select the `frontend` folder as root directory.
Add environment variable:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```
Click Deploy.
---
Backend Deployment
Deploy backend to Render.
Steps:
Create a new Web Service.
Connect GitHub repository.
Set root directory:
```text
backend
```
Build command:
```bash
npm install
```
Start command:
```bash
node server.js
```
Add environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
OLLAMA_URL=http://127.0.0.1:11434/api/generate
OLLAMA_MODEL=gemma4:3b-cloud
```
---
Deployment Notes
The deployed backend can call OpenRouter directly when these backend environment variables are configured:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-oss-120b:free
```
Do not expose `OPENROUTER_API_KEY` in the React frontend or GitHub repository.
Troubleshooting
Error: Ollama connection refused
Run:
```bash
ollama serve
```
Then check:
```bash
curl http://127.0.0.1:11434/api/tags
```
---
Error: Model not found
Run:
```bash
ollama pull gemma4:3b-cloud
```
Then check:
```bash
ollama list
```
---
Error: MongoDB connection failed
Make sure MongoDB is running:
```bash
mongod
```
Check your backend `.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/campus_ai_bridge
```
---
Error: Resume PDF upload returns 400
Check these points:
```text
1. File must be PDF.
2. File must be smaller than 5 MB.
3. FormData field name must be "resume".
4. Backend route must use upload.single("resume").
5. Restart backend after changing code.
```
---
Error: `pdfParse is not a function`
Install the correct package:
```bash
cd backend
npm uninstall pdf-parse
npm install pdf-parse@1.1.1
```
Then restart backend:
```bash
node server.js
```
---
Error: Frontend cannot connect to backend
Check:
```text
Frontend: http://localhost:3000
Backend: http://localhost:5000
```
Check `frontend/src/services/api.js`:
```js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default API;
```
---
Git Commands
Check project status:
```bash
git status
```
Add changes:
```bash
git add .
```
Commit changes:
```bash
git commit -m "Updated Campus AI Bridge project"
```
Push changes:
```bash
git push origin main
```
---
Author
Lanka Venkata Yagnesh
GitHub Repository:
Campus AI Bridge repository
