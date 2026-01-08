# SkillForgeAI

SkillForgeAI is an AI-powered platform for personalized learning, skill assessment, and adaptive roadmaps. It consists of a modern **Next.js** frontend and a robust **FastAPI** backend, designed for learners aiming to master Data Structures & Algorithms (DSA), ace interviews, and achieve career goals with AI-driven guidance.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Backend Documentation](#backend-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Setup & Installation](#setup--installation)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

SkillForgeAI provides:
- AI-driven skill diagnosis and personalized learning roadmaps
- Secure authentication and user management
- Task creation, submission, and evaluation
- Real-time chat assistant for DSA and interview prep
- Progress tracking and adaptive feedback

---

## Architecture

**Frontend:** Next.js (React), Tailwind CSS, Axios

**Backend:** FastAPI, Pydantic, JWT, MongoDB (via Motor), LangChain, Google GenAI, Groq

---

## Features

- **User Authentication:** Registration, login, logout, JWT-based sessions
- **Skill Diagnosis:** AI analysis of user skills and weaknesses
- **Personalized Roadmaps:** Dynamic, goal-driven learning plans
- **Task Management:** Task assignment, submission, and AI evaluation
- **Mentor Chatbot:** Real-time AI assistant for DSA/interview queries
- **Progress Tracking:** Skill vectors, history, and evidence tracking
- **Modern UI:** Responsive, accessible, and user-friendly interface

---

## Folder Structure

```
SkillForgeAI/
│
├── backend/         # FastAPI backend
│   ├── app/         # Main backend application
│   │   ├── ai/      # AI adapters, clients, prompts
│   │   ├── api/     # API endpoints (auth, users, tasks, etc.)
│   │   ├── core/    # Config, logging, exceptions
│   │   ├── db/      # Database models and repositories
│   │   ├── domain/  # Domain logic and business entities
│   │   ├── schemas/ # Pydantic models
│   │   ├── services/# Business logic/services
│   │   ├── tests/   # Unit/integration tests
│   │   └── utils/   # Utility functions
│   ├── requirements.txt
│   └── pyproject.toml
│
├── frontend/        # Next.js frontend
│   ├── app/         # App directory (routing, pages)
│   ├── components/  # UI components (chatbot, roadmap, etc.)
│   ├── context/     # React context (auth, etc.)
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility libraries
│   ├── services/    # API service wrappers
│   ├── store/       # State management
│   ├── styles/      # Global styles (Tailwind)
│   └── public/      # Static assets
│
└── README.md        # Project documentation
```

---

## Backend Documentation

### Tech Stack
- **Python 3.10+**
- **FastAPI** for API endpoints
- **Pydantic** for data validation
- **MongoDB** (Motor driver)
- **JWT** for authentication
- **LangChain, Google GenAI, Groq** for AI features

### Main Modules
- **Authentication:** Register, login, logout, token refresh (JWT in HTTP-only cookies)
- **User Management:** Profile, setup, and general info
- **Diagnosis:** AI-driven skill analysis
- **Learning State:** Skill vectors, history, and updates
- **Roadmap:** Personalized learning plans, slot management
- **Submissions:** Task submission and AI evaluation
- **Tasks:** Task retrieval and management

### Example API Endpoints

#### Auth
- `POST /auth/register` – Register new user
- `POST /auth/login` – Login and receive tokens
- `POST /auth/logout` – Logout user
- `POST /auth/refresh` – Refresh access token

#### Users
- `GET /users/current_user` – Get current user info
- `POST /users/setup_user` – Complete user setup
- `GET /users/general_profile` – Get full user profile

#### Diagnosis
- `POST /diagnose/` – Analyze skills and return weaknesses

#### Learning State
- `POST /learning_state/init` – Initialize learning state
- `GET /learning_state/` – Get current learning state
- `PATCH /learning_state/` – Update learning state

#### Roadmap
- `GET /roadmap` – Get current roadmap
- `POST /roadmap/init` – Generate new roadmap
- `GET /roadmap/latest` – Get latest roadmap

#### Roadmap Slot
- `POST /roadmap/slot/start` – Start a roadmap slot

#### Submissions
- `POST /submissions` – Submit and evaluate a task

#### Tasks
- `GET /tasks/` – Retrieve tasks

### Running the Backend

1. **Install dependencies:**
	```bash
	pip install -r requirements.txt
	```
2. **Configure environment variables:** (see `app/core/config.py`)
3. **Run the server:**
	```bash
	uvicorn app.main:app --reload
	```
4. **Run tests:**
	```bash
	pytest app/tests
	```

---

## Frontend Documentation

### Tech Stack
- **Next.js 16+** (React 19)
- **Tailwind CSS** for styling
- **Axios** for API requests

### Main Features
- **Authentication:** Login, register, logout (integrates with backend JWT)
- **Dashboard:** Personalized dashboard with roadmap, tasks, and chatbot
- **Roadmap:** Visualizes learning phases and slots
- **Tasks:** Task cards, submission, and feedback
- **Chatbot:** AI assistant for DSA/interview help
- **Setup Flow:** Onboarding for skills, goals, and languages

### Key Directories
- `app/` – Routing, pages (dashboard, auth, setup, etc.)
- `components/` – UI components (ChatbotTab, RoadmapTab, etc.)
- `services/` – API wrappers (auth, roadmap, task, chat)
- `context/` – Auth context provider
- `hooks/` – Custom hooks (useAuth, useChat, etc.)
- `store/` – State management (roadmap, skill, task)
- `styles/` – Tailwind global styles

### Running the Frontend

1. **Install dependencies:**
	```bash
	npm install
	# or
	yarn install
	```
2. **Configure environment variables:**
	- `NEXT_PUBLIC_API_URL` (backend URL, e.g., http://localhost:8000)
3. **Run the development server:**
	```bash
	npm run dev
	# or
	yarn dev
	```
4. **Open** [http://localhost:3000](http://localhost:3000)

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License.
