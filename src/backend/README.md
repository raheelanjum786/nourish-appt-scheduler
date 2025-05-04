
# Counseling App Backend

This is the backend for the counseling application, built with Express, Prisma and MySQL.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection string in `.env`

3. Set up the database:
   ```
   npm run prisma:migrate
   ```

4. Generate Prisma client:
   ```
   npm run prisma:generate
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Appointments
- GET `/api/appointments` - Get all appointments for current user
- POST `/api/appointments` - Create new appointment
- GET `/api/appointments/:id` - Get appointment by ID
- PATCH `/api/appointments/:id/status` - Update appointment status

### Messages
- GET `/api/messages` - Get all messages for current user
- GET `/api/messages/conversation/:userId` - Get conversation with specific user
- POST `/api/messages` - Send a message

### Services
- GET `/api/services` - Get all services
- POST `/api/services` - Create a new service (admin/provider only)
- GET `/api/services/:id` - Get service by ID
- PUT `/api/services/:id` - Update service
- DELETE `/api/services/:id` - Delete service

## Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio for database management
