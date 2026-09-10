# 🎙️ AI-Powered Podcast Planner Agent

An AI-powered web application that helps podcasters plan complete podcast episodes by generating structured content based on the **guest name** and **topic/background**.

The application uses an **OpenAI language model through LangChain** to generate episode ideas, guest profiles, interview questions, episode structure, social media content, and more.

---


## ✨ Features

- 🤖 **AI-Powered Podcast Planning** — Generate a complete podcast plan using AI.
- 👤 **Guest Profile Generation** — Get a detailed guest profile including:
  - Bio and career highlights
  - Interesting facts
  - Recent work/projects
  - Relevance to the selected topic
- 📝 **Episode Title & Description**
- 🎤 **Guest Introduction**
- ❓ **Interview Questions** — Generate 5–7 conversational questions.
- 🕒 **Episode Outline** — Structured segments with approximate timings.
- 🎲 **Icebreakers & Fun Facts**
- 📱 **Social Media Ideas** — Generate promotional post ideas.
- 📄 **PDF Download** — Download the generated podcast plan as a PDF.
- 🕘 **Podcast Plan History** — Access previously generated plans from the history sidebar.
- 💻 **Simple Web Interface** — Clean interface built with React.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML/CSS
- `marked` — Markdown rendering

### Backend
- Python
- FastAPI
- Uvicorn
- LangChain
- OpenAI API
- ReportLab — PDF generation

### Storage
- Browser `localStorage` for podcast plan history

---

## 🏗️ Project Architecture

```text
User
  │
  ▼
React Frontend
  │
  │ HTTP Request
  ▼
FastAPI Backend
  │
  ▼
LangChain
  │
  ▼
OpenAI LLM
  │
  ▼
Generated Podcast Plan
  │
  ├──────────────► React UI
  │
  ├──────────────► PDF Download
  │
  └──────────────► Browser localStorage
                         │
                         ▼
                    History Sidebar
```

---

## 📂 Project Structure

```text
AI-Powered-Podcast-Planner/
│
├── Backend/
│   ├── agent.py
│   ├── main.py
│   └── requirements.txt
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   └── ...
│   ├── package.json
│   └── package-lock.json
│
├── screenshots/
│   ├── input-screen.png
│   ├── generated-plan.png
│   ├── history-sidebar.png
│   └── pdf-export.png
│
└── README.md
```

---

## ⚙️ Requirements

Before running the project, make sure you have:

- **Python 3.10+**
- **Node.js and npm**
- An **OpenAI API key**
- Internet connection
- A modern web browser

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
```

---

# 🔹 Backend Setup

### 2. Navigate to the Backend

```bash
cd Backend
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

If you haven't created `requirements.txt`, the main dependencies are:

```text
fastapi
uvicorn
langchain
langchain-openai
openai
reportlab
```

### 5. Configure the OpenAI API Key

Add your OpenAI API key as an environment variable — do **not** hardcode it in the source.

```bash
export OPENAI_API_KEY="your-key-here"   # macOS/Linux
set OPENAI_API_KEY="your-key-here"      # Windows
```

Then read it in code, e.g.:

```python
import os

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    api_key=os.environ.get("OPENAI_API_KEY")
)
```

> ⚠️ **Important:** Do not upload your real API key to GitHub. Add `.env` and `venv/` to `.gitignore`.

### 6. Start the Backend Server

From the `Backend` folder:

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# 🔹 Frontend Setup

### 7. Open a New Terminal

Keep the backend server running and open another terminal.

Navigate to the frontend:

```bash
cd Frontend
```

### 8. Install Node Dependencies

```bash
npm install
```

### 9. Start the React Application

```bash
npm start
```

The frontend will usually run at:

```text
http://localhost:3000
```

---

## 🎯 How to Use

1. Open the React application in your browser.
2. Enter the **Guest Name**.
3. Enter the **Guest Background / Topic**.
4. Click **Generate Plan**.
5. The AI generates a complete podcast plan.
6. Read the generated plan directly in the application.
7. Click **Download PDF** to save the episode plan.
8. Previously generated plans can be accessed from the **History** sidebar.

---

## 🔌 API Endpoints

### Generate Podcast Plan

```http
GET /plan
```

Parameters:

```text
guest_name
topic
```

Example:

```text
/plan?guest_name=Elon%20Musk&topic=Technology
```

Response:

```json
{
  "podcast_plan": "Generated podcast plan..."
}
```

---

### Generate PDF

```http
POST /generate-pdf/
```

Request body:

```json
{
  "content": "Generated podcast plan..."
}
```

Returns the generated podcast plan as a PDF file.

---

## 🧠 AI Generation

The application uses **LangChain** to structure the interaction with the OpenAI language model.

The AI is instructed to generate:

```text
1. Episode Title & Description
2. Detailed Guest Profile
3. Guest Introduction
4. Interview Questions
5. Episode Outline
6. Icebreakers / Fun Facts
7. Social Media Post Ideas
8. Additional Insights
```

This transforms a simple guest/topic input into a complete episode-planning workflow.

---

## 📄 PDF Generation

The generated podcast plan can be downloaded as a PDF.

The backend uses **ReportLab** to create the PDF dynamically in memory. No temporary PDF files or folders are required on the server.

---

## 🕘 History Management

Podcast plans are stored in the browser using:

```javascript
localStorage
```

The application currently keeps the most recent **10 podcast plans**.

Since the history is stored locally, it is specific to the browser/device being used and is not shared between users.

---


A safer approach is to store the key in an environment variable.

Also consider adding sensitive files such as `.env` and `venv/` to `.gitignore`.

---
## 📸 Screenshots



### Guest & Topic Input Screen
![Input screen](Screenshots\Screenshot 2025-10-05 172919.png)
![Input screen](Screenshots\Screenshot 2025-10-05 173108.png)


### Generated Podcast Plan
![Generated podcast plan](Screenshots\Screenshot 2026-09-10 142214.png)
![Generated podcast plan](Screenshots\Screenshot 2025-10-05 172944.png)



### PDF Export
![PDF export](Screenshots\Screenshot 2025-10-05 173002.png)

---
---

## 🎓 Project Purpose

This project demonstrates the development of an **AI-powered full-stack application** by integrating:

- Generative AI
- LangChain
- OpenAI API
- REST APIs
- FastAPI
- React.js
- PDF generation
- Client-side data storage

It showcases how an AI model can be integrated into a practical web application to automate a real-world content planning workflow.

---


