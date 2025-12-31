# 🛍️ Spurnow Store - AI-Powered Customer Support Chat

A full-stack AI-powered customer support chatbot for an e-commerce store. Built as a take-home assignment for Spur.

## 🚀 Live Demo

🔗 **[Live URL](https://your-deployed-url.com)** *(Add your deployed URL here)*

---

## ✨ Features

- ✅ Real-time AI chat using **Groq API** (Llama 3.3 70B)
- ✅ Conversation persistence with PostgreSQL
- ✅ Session management for chat history
- ✅ Friendly, context-aware responses
- ✅ Error handling with graceful fallbacks
- ✅ Modern, responsive UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Backend** | NestJS, TypeScript |
| **Database** | PostgreSQL, TypeORM |
| **AI/LLM** | Groq API (Llama 3.3 70B) |

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Groq API Key** (free at [console.groq.com](https://console.groq.com))

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=spur_chat

# Groq AI API (Get free key at https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000