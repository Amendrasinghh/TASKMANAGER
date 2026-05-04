# TaskFlow — Running, Testing, and Deployment Guide

Follow this comprehensive guide to get your local environment running, test application functionality, and deploy to production.

---

## 1. Prerequisites
Ensure the following tools are installed on your machine:
- **Node.js** (v18 or v20 recommended)
- **Docker & Docker Compose** (Optional, for simplified local execution)
- **PostgreSQL** (If running locally without Docker)
- **Git**

---

## 2. Running Locally

### Option A: Using Docker Compose (Quickest)
This sets up PostgreSQL, the backend API, and handles all migrations and seeds automatically.
1. Make sure Docker is running.
2. In the root project directory, run:
   ```bash
   docker-compose up --build
   ```
3. Open the following endpoints:
   - **Frontend**: `http://localhost:5173`
   - **Backend**: `http://localhost:5000/api`

### Option B: Manual Local Setup
1. **Initialize a PostgreSQL database** locally or on a cloud provider.
2. **Setup Backend**:
   - Navigate to the backend folder: `cd backend`
   - Install dependencies: `npm install`
   - Copy the environment file example: `cp .env.example .env`
   - Update `DATABASE_URL` in `.env` with your Postgres connection string.
   - Run migrations and seed data:
     ```bash
     npx prisma migrate dev
     npx prisma db seed
     ```
   - Start the development server: `npm run dev`

3. **Setup Frontend**:
   - Navigate to the frontend folder: `cd ../frontend`
   - Install dependencies: `npm install`
   - Start the Vite development server: `npm run dev`

---

## 3. Testing the Application

### Accessing the Dashboard & Interface
1. Navigate to `http://localhost:5173/login` in your web browser.
2. Sign in with the seeded credentials:
   - **Admin User**: `admin@taskmanager.com` / Password: `Admin@123`
   - **Regular Member**: `member@taskmanager.com` / Password: `Member@123`

### End-to-End Validation Steps
- **Project Creation**: Click "New Project" on the Projects page, enter information, and verify it lists correctly.
- **Task Management**: Go to your project page, create tasks, and test switching between **Kanban** and **List** views. Update a task's status via the select dropdown.
- **Team Roles (Admin only)**: Sign in as the admin, navigate to the **Team** page, and update a member's role (e.g., promote a Member to Admin).

---

## 4. Making It Live & Deployment

### Choice 1: Deploying with Railway (Recommended)
Our codebase includes a `railway.toml` file ready for automatic multi-service builds.

1. **Sign up or log in** to [Railway](https://railway.app/).
2. Click **New Project** -> **Provision PostgreSQL** to initialize a managed database.
3. Once set up, copy the Railway-provided PostgreSQL **Connection URL**.
4. Create a new service from your GitHub repository:
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select your cloned TaskFlow repository.
5. In the new service **Variables** tab, add the following environment variables:
   - `DATABASE_URL`: Your Railway database connection URL.
   - `JWT_SECRET`: A secure random password string.
   - `JWT_EXPIRES_IN`: `7d`
   - `PORT`: `5000`
   - `FRONTEND_URL`: Your deployed frontend URL (or the URL assigned by Vite/Vercel/Railway).
6. Railway will read the `railway.toml` and build the backend.

### Choice 2: Deploying the Frontend to Vercel/Netlify
For the best user experience, you can separate the backend and frontend hosting:

1. Link your GitHub repository to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
2. Point the build output settings to the frontend directory:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set the API URL environment variable so the frontend routes correctly:
   - Add `VITE_API_URL` to point to your live backend service (e.g., `https://your-backend.railway.app/api`).
