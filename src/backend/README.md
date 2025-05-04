
# NutriCare Backend API

This directory contains the backend API for the NutriCare application.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL database

### Installation

1. Install dependencies:
```bash
cd src/backend
npm install
```

2. Create a `.env` file in the `src/backend` directory with the following content:
```
DATABASE_URL="mysql://username:password@localhost:3306/nutricare"
JWT_SECRET="your_secure_jwt_secret"
```

Replace `username`, `password` with your MySQL credentials and change the JWT secret to a secure random string.

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Seed the database with initial data (creates admin user):
```bash
npm run seed
```

Default admin credentials:
- Email: admin@nutricare.com
- Password: admin123

### Running the API

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The API will be available at http://localhost:3001/api

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user info (requires authentication)

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin or self)
- `PUT /api/users/:id` - Update user (admin or self)
- `DELETE /api/users/:id` - Delete user (admin or self)

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin or provider only)
- `PUT /api/services/:id` - Update service (admin or provider only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Appointments

- `GET /api/appointments` - Get appointments (filtered by user role)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment (client or admin only)
- `PATCH /api/appointments/:id/status` - Update appointment status

### Messages

- `GET /api/messages` - Get messages (filtered by user)
- `POST /api/messages` - Send a message
- `GET /api/messages/:id` - Get message by ID
- `PATCH /api/messages/:id` - Mark message as read
