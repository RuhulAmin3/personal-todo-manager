import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody, validateParams } from '../middleware/validation.js';
import { todoCreateSchema, todoUpdateSchema, idParamSchema } from '../validation/schemas.js';
import { getTodos, createTodo, updateTodo, deleteTodo, clearTodos } from '../controller/todoController.js';

const router = express.Router();

// Get all todos for authenticated user
router.get('/', authenticateToken, getTodos);

// Add new todo
router.post('/', authenticateToken, validateBody(todoCreateSchema), createTodo);

// Update todo
router.put('/:id', authenticateToken, validateParams(idParamSchema), validateBody(todoUpdateSchema), updateTodo);

// Delete todo
router.delete('/:id', authenticateToken, validateParams(idParamSchema), deleteTodo);

// Delete all todos on logout (bonus feature)
router.delete('/', authenticateToken, clearTodos);

export default router;