# TaskFlow — Team Task Manager

TaskFlow is a production-ready, full-stack team task management application built using Node.js, Express, PostgreSQL, Prisma, and React. It features role-based access control, task prioritization, status tracking (Kanban and list views), and real-time dashboard stats.

## Features
- **JWT-Based Authentication**: Secure authentication with persistent sessions.
- **Role-Based Access Control**: Admins can manage team members, change user roles, and access advanced administrative tools.
- **Project & Team Management**: Organize your work with color-coded projects and add members to your workspace.
- **Task Management**: Create tasks, assign priority, select status, set due dates, and update progress in real-time.
- **Interactive Views**: View tasks on a modern Kanban board or detailed list layout.
- **Real-Time Dashboard**: Comprehensive data overview with overdue task alerts and recent activity updates.

---

## Technical Stack
- **Frontend**: React 18, Vite, TailwindCSS, TanStack Query (React Query v5), React Router v6, Lucide React.
- **Backend**: Node.js, Express, Prisma ORM, JWT, BcryptJS.
- **Database**: PostgreSQL.
- **Containerization**: Docker & Docker Compose.

---

## Project Structure
```
team-task-manager/
├── backend/                  # Express backend with Prisma ORM
│   ├── prisma/               # Database schema and seed script
│   └── src/
│       ├── controllers/      # Route controllers for authentication, tasks, projects
│       ├── middleware/       # JWT auth, authorization, error handler, validation
│       ├── routes/           # Express API endpoint definitions
│       ├── utils/            # JWT, response, date utilities
│       └── validators/       # Zod data schemas
├── frontend/                 # Vite + React client
│   ├── src/
│   │   ├── api/              # Axios configuration & API callers
│   │   ├── components/       # UI, Layout, Dashboard, Project, Task, Team components
│   │   ├── contexts/         # Authentication context
│   │   ├── hooks/            # TanStack Query & custom hooks
│   │   ├── pages/            # Page-level components
│   │   ├── routes/           # Route guards (PrivateRoute, AdminRoute)
│   │   └── utils/            # Status, priority, date styling rules
└── docker-compose.yml        # Docker orchestration config
```

---

## Setup & Running Locally

### Prerequisites
- Node.js (v20+)
- PostgreSQL (or use Docker Compose)

### Running with Docker Compose
To launch the entire application seamlessly using Docker Compose:
```bash
docker-compose up --build
```
The frontend will be available at `http://localhost:5173` and the API at `http://localhost:5000/api`.

### Manual Local Setup
1. **Database Setup**:
   Ensure you have a PostgreSQL instance running. Set the connection string in your `.env` file within the `backend` folder.

2. **Backend**:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

3. **Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Demo Credentials
- **Admin**: `admin@taskmanager.com` / `Admin@123`
- **Member**: `member@taskmanager.com` / `Member@123`
