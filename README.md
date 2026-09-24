# Hostel Maintenance API

A REST API for managing hostel maintenance requests with USER and ADMIN roles.

## Features

- User registration and login
- JWT authentication using HTTP-only cookies
- Password hashing with bcrypt
- USER and ADMIN role-based access control
- Create, view, update and cancel maintenance requests
- Admin assignment and status management
- Resolution and closing workflow
- MongoDB with Mongoose
- Request validation
- Centralized error handling
- Postman collection for API testing

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Postman

## Setup

Install dependencies:

npm install

Create a .env file using .env.example and add your MongoDB connection string and JWT secret.

Start the server:

npm start

Development mode:

npm run dev

## Seed Admin

npm run seed

Admin credentials:

Email: admin@hostel.com
Password: Admin@123

## API Routes

### Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

### User Requests

POST /api/requests
GET /api/requests
GET /api/requests/:id
PUT /api/requests/:id
DELETE /api/requests/:id

### Admin

GET /api/admin/requests
GET /api/admin/requests/:id
PATCH /api/admin/requests/:id/assign
PATCH /api/admin/requests/:id/status
PATCH /api/admin/requests/:id/resolve
PATCH /api/admin/requests/:id/close

## Request Status Flow

Open → In Progress → Resolved → Closed

## Postman

A complete Postman collection containing success and failure test cases is available in the postman folder.

## Security

- Passwords are hashed using bcrypt.
- JWT is stored in an HTTP-only cookie.
- Protected routes require authentication.
- Admin routes require the ADMIN role.
- Environment secrets are stored in .env and excluded from Git.