import express from 'express';
import authRoutes from './route/auth.js';
import todoRoutes from './route/todo.js';
import webRoutes from './route/web.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/', webRoutes);

// Home route
app.get('/api', (req, res) => {
  res.json({
    message: 'Todo App API',
    endpoints: {
      auth: {
        'POST /api/auth/signup': 'Create new account',
        'POST /api/auth/login': 'Login to account',
        'GET /api/auth/profile': 'Get user profile (requires auth)',
        'POST /api/auth/logout': 'Logout (requires auth)'
      },
      todos: {
        'GET /api/todos': 'Get user todos (requires auth)',
        'POST /api/todos': 'Create new todo (requires auth)',
        'PUT /api/todos/:id': 'Update todo (requires auth)',
        'DELETE /api/todos/:id': 'Delete todo (requires auth)',
        'DELETE /api/todos': 'Clear all todos (requires auth)'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});