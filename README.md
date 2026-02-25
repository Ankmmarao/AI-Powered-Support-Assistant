<img width="1920" height="1020" alt="AI Support Assistant and 10 more pages - Personal - Microsoft​ Edge 25-02-2026 10_48_44" src="https://github.com/user-attachments/assets/ca825a66-df56-4881-931e-a3b7a5225e4c" />
# AI-Powered Support Assistant

An **AI-powered full-stack support assistant** that answers user queries based on provided product documentation.  
The assistant maintains **session-wise chat history** and stores all messages in **SQLite**.

---

## 🌐 Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js + Express  
- **Database:** SQLite  
- **LLM:** Gemini API / OpenAI / any LLM provider  

---

## 🛠 Setup Steps

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ankmmarao/AI-Powered-Support-Assistant.git
cd AI-Powered-Support-Assistant


Backend:

cd backend
npm install
cp .env.example .env
# Edit .env to include PORT and LLM_API_KEY
npm run start

Backend runs at http://localhost:5000

Frontend:

cd frontend
npm install
npm start

Frontend runs at http://localhost:3000

API Documentation

POST /api/chat
Request: { "sessionId": "abc123", "message": "How can I reset my password?" }
Response: { "reply": "Users can reset password from Settings > Security.", "tokensUsed": 123 }

GET /api/conversations/:sessionId
Returns all messages for a session. Example:

[
  { "role": "user", "content": "hi", "created_at": "2026-02-24 12:13:34" },
  { "role": "assistant", "content": "Sorry, I don’t have information about that.", "created_at": "2026-02-24 12:37:26" }
]

GET /api/sessions
Returns list of sessionIds with timestamps. Example:

[
  { "id": "02960d57-cd09-4c96-be24-ee7c7d75af49", "created_at": "2026-02-24 12:13:34", "updated_at": "2026-02-24 12:38:21" }
]
Database Schema

sessions

id TEXT PRIMARY KEY

created_at DATETIME

updated_at DATETIME

messages

id INTEGER PRIMARY KEY AUTOINCREMENT

session_id TEXT FOREIGN KEY → sessions(id)

role TEXT ("user"/"assistant")

content TEXT

created_at DATETIME

Assumptions & Rules

AI responds only using docs.json content.

Unknown questions return "Sorry, I don’t have information about that."

Context: last 5 user+assistant message pairs from SQLite.

Rate limiting per IP enabled.

Frontend stores sessionId in localStorage.

LLM API key required in .env.

Project Structure
innoira-support-assistant/
├─ backend/
│  ├─ server.js
│  ├─ db.js
│  ├─ routes/
│  ├─ middleware/
│  ├─ package.json
│  └─ support.db
├─ frontend/
│  ├─ public/
│  ├─ src/
│  ├─ package.json
├─ docs.json
├─ .env.example
└─ README.md
Deployment Notes

On Render: set Root Directory = backend, start command node server.js.

Ensure .env variables are set (PORT & LLM_API_KEY).

Frontend can be deployed separately (Vercel/Netlify).

Ensure SQLite file is included in backend for session persistence.


---


Do you want me to do that next?
