# 🚀 InterviewIQ AI

### AI-Powered Interview Preparation & Resume Intelligence Platform

InterviewIQ AI is a full-stack AI application that helps candidates prepare for technical interviews through intelligent answer evaluation, adaptive questioning, resume-based interviews, personalized learning roadmaps, and performance analytics.

Instead of simply asking questions, InterviewIQ AI acts like an AI interviewer that evaluates responses, identifies weak areas, tracks progress, and generates targeted improvement plans.

---

## ✨ Key Features

### 🎯 AI Answer Evaluation

* Evaluates interview answers using LLMs
* Measures:

  * Technical Accuracy
  * Clarity
  * Communication
  * Depth of Knowledge
* Generates strengths, weaknesses, and improvement suggestions
* Provides overall interview score and recommendation

---

### 🧠 Adaptive Interview Engine

* Dynamically adjusts question difficulty
* Easy → Medium → Hard progression
* Personalized based on previous performance

---

### 📄 Resume Intelligence

Upload a resume PDF and instantly get:

* Resume strength score
* Candidate profile summary
* Skills extraction
* Project extraction
* Resume-specific interview questions

This simulates the first stage of many real-world technical interviews where recruiters ask questions directly from a candidate's resume.

---

### 📊 Analytics Dashboard

Track performance through:

* Average score monitoring
* Strongest skill identification
* Weakest skill identification
* Skill radar chart visualization
* Interview history tracking

---

### 🎓 Personalized Learning Roadmaps

After every evaluation the system:

* Detects knowledge gaps
* Identifies focus areas
* Generates a customized learning roadmap
* Recommends next improvement steps

---

### 🎤 Mock Interview Experience

Candidates can:

* Generate AI interview questions
* Attempt interviews across topics
* Receive instant feedback
* Track long-term progress

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
* Recharts
* CSS

### Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic
* PyPDF

### AI Layer

* Groq API
* Llama 3.1 8B Instant

### Database

* SQLite

---

## 📌 Core Modules

### Interview Evaluation Engine

Analyzes candidate answers and generates structured feedback.

### Adaptive Question Generator

Creates difficulty-adjusted interview questions.

### Resume Analyzer

Extracts insights directly from uploaded resumes.

### Analytics Engine

Tracks performance and visualizes strengths and weaknesses.

### Learning Roadmap Generator

Creates personalized improvement plans based on evaluation results.

---

## 📸 Screenshots

### Dashboard

Dashboard.png

### Resume Analysis

resume_based.png

### Analytics Dashboard

Analytics.png

### History

history.png

### Evaluation

Evaluation.png

### Mock Interview

Mock Interview.png

---

## 🎯 Future Improvements

* Voice-based mock interviews
* Company-specific interview modes (Google, Amazon, Microsoft)
* JWT Authentication
* Multi-user support
* PostgreSQL migration
* Cloud deployment
* Exportable interview reports

---

## 👨‍💻 Author

**Kumkum**

B.Tech Computer Science & Engineering (Data Science)

Passionate about AI, Full Stack Development, and Building Intelligent Systems.

---

### ⭐ If you found this project interesting, consider giving it a star.
