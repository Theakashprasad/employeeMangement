# Employee Management System

Full-stack employee management app with JWT authentication, CRUD, analytics, search/filter, and pagination.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, Axios, Recharts, Tailwind CSS, Sonner
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## Prerequisites

- Node.js 18+
- MongoDB running locally or Atlas URI

## Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=employee_management
JWT_ACCESS_TOKEN_SECRET_KEY=your_secret_key_min_32_chars
CLIENT_ORIGINS=http://localhost:5173
```

```bash
npm run dev
```

API runs at `http://localhost:3000`

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/logout` | No | Clear cookie |
| GET | `/api/employees` | Yes | List (pagination, search, filter) |
| GET | `/api/employees/analytics` | Yes | Dashboard stats |
| GET | `/api/employees/:id` | Yes | Get one |
| POST | `/api/employees` | Yes | Create |
| PUT | `/api/employees/:id` | Yes | Update |
| DELETE | `/api/employees/:id` | Yes | Delete |

**Auth header:** `Authorization: Bearer <token>`

Sample employees are auto-seeded when the database is empty.

## Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE=http://localhost:3000/api
```

```bash
npm run dev
```

Open `http://localhost:5173`

## Features

1. **Authentication** – Login/signup, JWT in localStorage, protected routes, logout
2. **Employee listing** – Table with name, email, department, designation, status, joining date
3. **CRUD** – Create/edit modal, delete confirmation
4. **Search & filter** – Debounced search by name/email, department & status filters
5. **Analytics** – Total/active employees, department chart, status pie, monthly joins
6. **Pagination** – Server-side paginated listing
7. **UX** – Loading spinners, error alerts with retry, empty states

## Project Structure

```
backend/src/
  Controllers/   authController, employeeController
  Models/        userModel, employeeModel
  Routes/        authRoutes, employeeRoutes
  Middlewares/   authenticationMiddleware

frontend/src/
  context/       AuthContext
  routes/        AppRoutes, paths
  services/      http, login, signup, employee
  pages/         Login, SignUp, Dashboard
  components/    dashboard, employees, layout, ui
```
