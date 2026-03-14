# Roomify Project Overview

## Project Description
Roomify is a web application designed to help users find roommates and manage room-sharing activities. It allows users to register as either "Host" (room providers) or "Finder" (room seekers), login, view dashboards, manage profiles, and connect with potential roommates.

## Project Architecture
The application follows a full-stack architecture with:
- **Backend**: Node.js with Express.js framework
- **Frontend**: React.js with Redux for state management
- **Database**: MySQL
- **Authentication**: JWT-based (password hashing with bcrypt)

## Project Flow
1. **User Registration**: New users fill out registration form with personal details
2. **Email Verification**: System checks for existing users and validates input
3. **Account Creation**: User data is stored in database with hashed password
4. **Login Process**: Users authenticate with email/password
5. **Dashboard Access**: Authenticated users access personalized dashboard
6. **Profile Management**: Users can update their profiles
7. **Roommate Finding**: Users can browse and connect with potential roommates
8. **Logout**: Users can securely log out, clearing session data

## Backend Structure

### Controllers
Controllers handle business logic and interact with models. Located in `backend/controllers/`:
- `registerController.js`: Handles user registration logic
- `loginController.js`: Manages user authentication
- `forgotPasswordController.js`: Processes password reset requests
- `resetPasswordController.js`: Handles password reset with tokens
- `profileController.js`: Manages user profile operations (if exists)

### Models
Models define data structures and database interactions. Located in `backend/models/`:
- `registerModel.js`: Contains functions to insert new users into database
- `loginModel.js`: Queries database for user authentication
- `userModel.js`: General user data operations

### Routes
Routes define API endpoints and connect them to controllers. Located in `backend/routes/`:
- `authRoutes.js`: Authentication endpoints (/api/auth/register, /login, /forgot-password, /reset-password)
- `dashboardRoutes.js`: Dashboard data endpoints
- `profileRoutes.js`: Profile management endpoints

### Data Storage
- **Database**: MySQL database named "roomify"
- **Tables**:
  - `users`: Stores user information (id, name, email, password, user_type, gender, etc.)
  - `rooms`: Stores room listings (host_id, location, rent, availability)
  - `connect`: Manages connections between finders and hosts
  - `review`: Stores reviews for connections
  - `plans`: Subscription plans
  - `payment`: Payment records
- **Connection**: Uses mysql2/promise for async database operations
- **Schema**: Defined in `backend/schema.sql`

## Frontend Structure

### Components
Reusable UI components in `frontend/src/Component/`:
- `Header.jsx`: Navigation header with user menu
- `Sidebar.jsx`: Dashboard sidebar navigation
- `Footer.jsx`: Page footer
- `RoomCard.jsx`: Displays room information

### Pages
Main application pages in `frontend/src/pages/`:
- **Auth Pages**: Login, Registration, ForgotPassword, ResetPassword
- **User Pages**: Dashboard, Profile, FindRoommates, Requests, Notifications
- **Home**: Landing page

### State Management
- **Redux Store**: Manages global application state
- **Slices**: `authSlice.js` (authentication), `dashboardSlice.js` (dashboard data)
- **Actions**: Async thunks for API calls (registerUser, loginUser, etc.)

### Routing
- **React Router**: Handles client-side navigation
- **Protected Routes**: Dashboard routes require authentication

## API Integration

### How Frontend Calls APIs
1. **Axios Library**: Used for making HTTP requests to backend
2. **Redux Thunks**: Async actions dispatch API calls and update state
3. **Base URL**: `http://localhost:5000/api/` (configurable)
4. **Authentication**: JWT tokens stored in localStorage for authenticated requests

### API Endpoints List

#### Authentication APIs (`/api/auth/`)
- `POST /register`: User registration
- `POST /login`: User login
- `POST /forgot-password`: Request password reset
- `POST /reset-password/:token`: Reset password with token

#### Dashboard APIs (`/api/dashboard/`)
- `GET /stats`: Get user/room/connection counts

#### Profile APIs (`/api/profile/`)
- `GET /:id`: Get user profile
- `PUT /:id`: Update user profile
- `DELETE /:id`: Delete user account

## Key Features

### User Management
- User registration with validation
- Secure login/logout
- Password reset via email
- Profile management

### Roommate Finding
- Browse available rooms
- Connect with hosts/finders
- Send/receive connection requests

### Dashboard
- User statistics overview
- Recent activities
- Profile access
- Navigation to features

### Subscription System
- Multiple plans (basic, premium, etc.)
- Payment processing
- Feature access based on plan

### Review System
- Rate connections
- Leave feedback
- Build reputation

## Security Features
- Password hashing with bcrypt
- Input validation
- SQL injection prevention
- CORS enabled
- Session management

## Development Setup
1. Install dependencies: `npm install` (both backend and frontend)
2. Set up MySQL database with schema.sql
3. Configure environment variables (.env)
4. Start backend: `npm start` (port 5000)
5. Start frontend: `npm run dev` (port 5173)

## Technologies Used
- **Backend**: Node.js, Express.js, MySQL, bcrypt, JWT
- **Frontend**: React, Redux, Axios, React Router
- **Styling**: CSS modules
- **Build Tools**: Vite, ESLint
- **Version Control**: Git