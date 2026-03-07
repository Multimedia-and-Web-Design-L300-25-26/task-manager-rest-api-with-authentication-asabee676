# Task Manager API - AI Coding Guidelines

## Architecture Overview
This is a Node.js REST API using Express and MongoDB for task management with JWT authentication. Users register/login and manage personal tasks. Key components:
- **Controllers**: Handle business logic (authController.js, taskController.js)
- **Models**: Mongoose schemas (User.js with email/password, Task.js with title/description/user ref)
- **Middleware**: JWT authentication (authMiddleware.js)
- **Routes**: API endpoints (/api/auth/*, /api/tasks/*)

## Key Patterns
- **Authentication**: Use `Authorization: Bearer <token>` header. Middleware verifies JWT and attaches user to req.user
- **User Ownership**: Tasks belong to authenticated user via user._id. Filter queries with `{ user: req.user._id }`
- **Password Security**: Hash with bcrypt before storing. Never return passwords in responses
- **Error Handling**: Use appropriate HTTP status codes (400 for bad request, 401 unauthorized, 404 not found, 500 server error)
- **ES Modules**: Use import/export syntax throughout

## Development Workflow
- **Setup**: `npm install`, copy .env.example to .env with MONGO_URI, JWT_SECRET, PORT=5000
- **Run**: `npm run dev` (nodemon) or `npm start` (production)
- **Test**: `npm test` runs Jest tests
- **Database**: Connect via mongoose.connect(process.env.MONGO_URI)

## Code Examples
- **Auth Middleware**: `const token = req.header('Authorization')?.replace('Bearer ', ''); jwt.verify(token, process.env.JWT_SECRET)`
- **Task Creation**: `const task = new Task({ ...req.body, user: req.user._id }); await task.save()`
- **User Registration**: Check unique email, hash password with bcrypt, return user without password field

## File Structure Reference
- `src/app.js`: Main Express app setup, middleware, routes
- `src/models/User.js`: Email, password fields; pre-save hook for hashing
- `src/routes/taskRoutes.js`: Protected routes with auth middleware
- `tests/`: Jest tests for auth and task endpoints

Focus on user-specific data isolation and secure authentication flows. Use Mongoose for all DB operations.