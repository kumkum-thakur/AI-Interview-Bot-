# 🚀 InterviewIQ AI

## AI-Powered Interview Preparation & Resume Intelligence Platform

InterviewIQ AI is a full-stack AI-powered platform designed to help students, job seekers, and professionals prepare for technical interviews through intelligent answer evaluation, adaptive questioning, resume-based interviews, performance analytics, and personalized learning roadmaps.

Unlike traditional interview preparation platforms, InterviewIQ AI acts as an AI interviewer that evaluates responses, identifies weak areas, tracks progress, and generates targeted improvement plans.

---

## 🌐 Live Demo

### Frontend Application

https://ai-interview-bot-pied.vercel.app

### Backend API

https://ai-interview-bot-bbcn.onrender.com

### API Documentation (Swagger)

https://ai-interview-bot-bbcn.onrender.com/docs

### GitHub Repository

https://github.com/kumkum-thakur/AI-Interview-Bot-

---

## ✨ Key Features

### 🎯 AI Answer Evaluation

* Evaluates candidate answers using Large Language Models
* Measures:

  * Technical Accuracy
  * Communication Skills
  * Clarity
  * Depth of Knowledge
* Generates:

  * Overall Score
  * Strengths
  * Weaknesses
  * Improvement Suggestions
  * Final Recommendation

---

### 🧠 AI Question Generation

* Generates interview questions on demand
* Supports multiple technical domains
* Helps users practice topic-wise interviews
* Produces realistic interview-style questions

---

### 📄 Resume Intelligence

Upload a resume and instantly receive:

* Resume Summary
* Skills Extraction
* Project Analysis
* Resume-Based Interview Questions
* Candidate Strength Assessment

This simulates the first stage of real-world technical interviews where recruiters ask questions directly from a candidate’s resume.

---

### 📊 Analytics Dashboard

Track interview performance through:

* Average Score Monitoring
* Performance Trends
* Strongest Skill Identification
* Weakest Skill Identification
* Interview Progress Tracking

---

### 🎓 Personalized Learning Roadmaps

The system:

* Detects knowledge gaps
* Identifies weak concepts
* Suggests learning priorities
* Generates customized improvement plans
* Recommends next learning steps

---

### 🎤 Mock Interview Experience

Candidates can:

* Generate interview questions
* Attempt technical interviews
* Receive instant AI feedback
* Practice repeatedly
* Monitor long-term growth

---

## 🏗️ System Architecture

```text
React Frontend
       │
       ▼
FastAPI Backend
       │
       ▼
Groq LLM API
       │
       ▼
SQLite Database
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Axios
* Recharts
* CSS

### Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic

### AI Layer

* Groq API
* Llama 3.1 8B Instant

### Database

* SQLite

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 📌 Core Modules

### Interview Evaluation Engine

Analyzes candidate answers and generates structured feedback.

### Question Generation Engine

Creates interview questions for multiple technical domains.

### Resume Analyzer

Extracts skills, projects, and candidate insights from resumes.

### Analytics Engine

Tracks performance metrics and visualizes strengths and weaknesses.

### Learning Roadmap Generator

Creates personalized improvement plans based on evaluation results.

### History Management System

Stores interview attempts and enables progress tracking.

---

## 📸 Screenshots

### Dashboard

Dashboard.png

### Resume Analysis

resume_based.png

### Analytics Dashboard

Analytics.png

### History Tracking

history.png

### Answer Evaluation

Evaluation.png

### Mock Interview

Mock Interview.png

---

## 🚀 Deployment

### Frontend

Hosted on Vercel

https://ai-interview-bot-pied.vercel.app

### Backend

Hosted on Render

https://ai-interview-bot-bbcn.onrender.com

---

## ⚙️ Local Development Setup

### Clone Repository

```bash
git clone https://github.com/kumkum-thakur/AI-Interview-Bot-.git
cd AI-Interview-Bot-
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🎯 Future Improvements

* Voice-Based Mock Interviews
* Company-Specific Interview Modes

  * Google
  * Amazon
  * Microsoft
  * Adobe
* JWT Authentication
* Multi-User Support
* PostgreSQL Migration
* Exportable PDF Interview Reports
* AI Career Guidance Assistant
* Interview Performance Leaderboards

---

## 👨‍💻 Author

### Kumkum

B.Tech Computer Science & Engineering (Data Science)

Passionate about:

* Artificial Intelligence
* Full Stack Development
* Machine Learning
* Building Intelligent Systems

GitHub:
https://github.com/kumkum-thakur

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

Contributions, feedback, and suggestions are always welcome.
