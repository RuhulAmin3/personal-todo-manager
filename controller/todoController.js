import { v4 as uuidv4 } from 'uuid';
import { readJSONFile, writeJSONFile } from '../utils/fileUtils.js';

// GET /api/todos
export const getTodos = async (req, res) => {
  try {
    const todos = await readJSONFile('todo.json');
    const userTodos = todos.filter((todo) => todo.userId === req.user.id);
    return res.json({ success: true, todos: userTodos });
  } catch (error) {
    console.error('Get todos error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch todos' });
  }
};

// POST /api/todos
export const createTodo = async (req, res) => {
  try {
    const { text } = req.body;
    const todos = await readJSONFile('todo.json');
    const newTodo = {
      id: uuidv4(),
      userId: req.user.id,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    await writeJSONFile('todo.json', todos);

    return res.status(201).json({ success: true, message: 'Todo created successfully', todo: newTodo });
  } catch (error) {
    console.error('Add todo error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create todo' });
  }
};

// PUT /api/todos/:id
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const todos = await readJSONFile('todo.json');
    const todoIndex = todos.findIndex((todo) => todo.id === id && todo.userId === req.user.id);

    if (todoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    if (text !== undefined) {
      todos[todoIndex].text = text.trim();
    }
    if (completed !== undefined) {
      todos[todoIndex].completed = completed;
    }
    todos[todoIndex].updatedAt = new Date().toISOString();

    await writeJSONFile('todo.json', todos);

    return res.json({ success: true, message: 'Todo updated successfully', todo: todos[todoIndex] });
  } catch (error) {
    console.error('Update todo error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update todo' });
  }
};

// DELETE /api/todos/:id
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todos = await readJSONFile('todo.json');
    const todoIndex = todos.findIndex((todo) => todo.id === id && todo.userId === req.user.id);

    if (todoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    await writeJSONFile('todo.json', todos);

    return res.json({ success: true, message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    console.error('Delete todo error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete todo' });
  }
};

// DELETE /api/todos
export const clearTodos = async (req, res) => {
  try {
    const todos = await readJSONFile('todo.json');
    const remainingTodos = todos.filter((todo) => todo.userId !== req.user.id);
    const deletedCount = todos.length - remainingTodos.length;

    await writeJSONFile('todo.json', remainingTodos);

    return res.json({ success: true, message: 'All todos cleared successfully', deletedCount });
  } catch (error) {
    console.error('Clear todos error:', error);
    return res.status(500).json({ success: false, message: 'Failed to clear todos' });
  }
};