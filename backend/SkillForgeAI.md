# SkillForgeAI

SkillForgeAI is an AI-powered backend system designed to facilitate personalized learning, skill assessment, and adaptive roadmaps for users. The project is structured as a modular Python application, leveraging FastAPI and modern best practices for maintainability and scalability.

## Project Structure

- **app/**: Main application package
  - **ai/**: AI adapters, clients, and prompt templates
  - **api/**: FastAPI route handlers for authentication, diagnosis, learning state, roadmaps, tasks, and users
  - **core/**: Core configuration, constants, logging, and exception handling
  - **db/**: Database models and repository classes for data access
  - **domain/**: Domain logic for roadmap transitions, validation, and business entities
  - **schemas/**: Pydantic models for request/response validation and serialization
  - **services/**: Business logic and service layer for AI, authentication, diagnosis, evaluation, learning state, mentoring, roadmaps, skills, tasks, and users
  - **tests/**: Unit and integration tests for core modules and APIs
  - **utils/**: Utility functions for security and time management
- **pyproject.toml**: Project metadata and dependencies
- **requirements.txt**: List of Python dependencies
- **README.md**: Project overview and setup instructions


## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user. Sets access and refresh tokens as cookies on success.
- **POST /auth/login**: Log in an existing user. Sets access and refresh tokens as cookies on success.
- **POST /auth/logout**: Log out the current user. Deletes authentication cookies.
- **POST /auth/refresh**: Refresh the access token using a valid refresh token cookie.

### User

- **GET /users/current_user**: Get the current authenticated user's basic info (id, email, setup status).
- **POST /users/setup_user**: Set up user skills and profile (requires authentication).
- **GET /users/general_profile**: Get the full user profile (requires authentication).

### Diagnosis

- **POST /diagnose/**: Diagnose weak skills from a provided skill dictionary. Returns a list of weak skills.

### Learning State

- **POST /learning_state/init**: Initialize a new learning state for the user (optionally for a specific roadmap).
- **GET /learning_state/**: Retrieve the current user's learning state.
- **PATCH /learning_state/**: Update the user's learning state with provided data.

### Roadmap

- **GET /roadmap**: Retrieve the currently active roadmap for the logged-in user.
- **POST /roadmap/init**: Initialize a new roadmap for the user (fails if one already exists).

### Roadmap Slot

- **POST /roadmap/slot/start**: Start a specific slot in the active roadmap phase. Returns a hint and updated roadmap.
- **POST /roadmap/slot/complete**: Complete a slot (success or failure) and update skill vector and roadmap.
- **POST /roadmap/slot/remediate**: Mark a slot for remediation in the roadmap.

### Slots (Task Instances)

- **POST /slots/{slot_id}/start**: Start a task slot in the roadmap. Returns task instance details and slot info.

### Tasks

- **GET /tasks/**: Retrieve protected tasks for the current user (example endpoint).

### Submission

- **/submit**: (Endpoint exists, but not yet implemented.)

---

## Key Features

- **User Authentication**: Secure registration, login, logout, and token refresh endpoints
- **Skill Diagnosis**: AI-driven diagnosis of user skills and learning needs
- **Personalized Roadmaps**: Dynamic generation and management of learning roadmaps
- **Task Management**: Creation, submission, and evaluation of learning tasks
- **Skill Tracking**: Evidence and history tracking for user skill progression
- **Mentor Integration**: AI mentor services for guidance and feedback

## Technologies Used

- Python 3.x
- FastAPI
- Pydantic
- SQLAlchemy (assumed for DB layer)
- JWT for authentication
- Pytest for testing

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure environment variables** as needed (see `app/core/config.py`)
4. **Run the application**
   ```bash
   uvicorn app.main:app --reload
   ```
5. **Run tests**
   ```bash
   pytest app/tests
   ```

## Folder Overview

| Folder/File         | Purpose                                              |
|--------------------|------------------------------------------------------|
| app/ai/            | AI adapters, clients, and prompt templates           |
| app/api/           | API endpoints for all major features                 |
| app/core/          | Core configuration, constants, and logging           |
| app/db/            | Database models and repositories                     |
| app/domain/        | Domain logic and business entities                   |
| app/schemas/       | Pydantic models for data validation                  |
| app/services/      | Service layer for business logic                     |
| app/tests/         | Unit and integration tests                           |
| app/utils/         | Utility functions                                    |
| pyproject.toml     | Project metadata and dependencies                    |
| requirements.txt   | Python dependencies                                  |
| README.md          | Project overview and setup instructions              |

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
