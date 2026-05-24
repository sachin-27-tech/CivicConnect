# CivicConnect - Civic Issue Reporting System

CivicConnect is a complete MERN Stack minor-project application for reporting and tracking local civic issues such as potholes, garbage overflow, broken streetlights, water leakage, and public infrastructure damage.

## Features

- Citizen registration, login, logout, and JWT-protected sessions
- Admin and citizen roles
- Password hashing with bcrypt
- Issue reporting with title, description, category, image upload, and geolocation
- Citizen "My Reports" page for status tracking
- Public home page with recent issues, statistics, and Leaflet map markers
- Admin dashboard with summary statistics, search, category filter, status filter, and status updates
- Local file storage for uploaded issue photos
- Clean MVC backend architecture and reusable React components

## Tech Stack

Frontend:
- React
- React Router
- Axios
- Leaflet / React Leaflet
- Plain CSS

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer

## Project Structure

```text
CivicConnect/
|-- client/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   `-- package.json
|-- docs/
|   `-- DEPLOYMENT.md
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- uploads/
|   |-- utils/
|   |-- server.js
|   `-- package.json
|-- .env.production.example
|-- Procfile
|-- render.yaml
|-- package.json
`-- README.md
```

## Installation

Install MongoDB locally and make sure it is running.

Install all dependencies from the project root:

```bash
npm install
```

The root `postinstall` script installs both backend and frontend dependencies.

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/civicconnect
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Create `client/.env` if you need to override defaults:

```env
VITE_API_URL=/api
VITE_SERVER_URL=
```

For local development, Vite proxies `/api` and `/uploads` to the backend at `http://localhost:5000`.

Example files are included as `server/.env.example` and `client/.env.example`.

## Running the App

From the project root:

```bash
npm run dev
```

This starts:
- Backend API at `http://localhost:5000`
- Frontend app at `http://localhost:5173`

## Production Deployment

The project is deployment-ready as a single Node service.

Build the React app:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

When `NODE_ENV=production`, Express serves:
- React frontend from `client/dist`
- API routes from `/api`
- Uploaded images from `/uploads`

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Render, Railway, and Heroku instructions.

## User Roles

Citizen:
- Register and login
- Submit reports with photo and location
- View and track own reports

Admin:
- Login
- View all reports
- Search and filter reports
- Update report status
- View summary statistics

During registration, choose `Admin` to create an admin account for demonstration.

## API Documentation

Authentication:

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

Reports:

```http
POST /api/reports
GET /api/reports
GET /api/reports/my
GET /api/reports/:id
PUT /api/reports/:id/status
```

Admin:

```http
GET /api/admin/stats
```

## Report Categories

- Road Damage
- Garbage
- Streetlight
- Water Leakage
- Other

## Status Workflow

- Pending
- In Progress
- Resolved

New reports are created with `Pending` status. Admin users can update status from the dashboard.

## Notes

- Uploaded images are stored locally in `server/uploads`.
- Leaflet uses OpenStreetMap tiles for the interactive map.
- No AI, notifications, email, SMS, real-time sockets, department management, or complex analytics are included.
